#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {getDb,REPO_ROOT} from './lib/db.mjs';
import {parseCsv} from './lib/csv.mjs';
import {table} from './lib/format.mjs';
export const READS={
 sites:'select code,name,region,owner,country,cadence_days from store.sites order by code',
 standards:'select code,section,question,weight,critical,active from store.standards order by section,code',
 audits:'select code,site,title,auditor,due_date,visited_on,status from store.audits a join lateral (select name site from store.sites where id=a.site_id) s on true order by due_date,code',
 'visit-plan':"select a.code,s.name site,a.auditor,a.due_date from store.audits a join store.sites s on s.id=a.site_id where a.status='planned' order by a.due_date,a.code",
 scorecard:'select code,site,status,total_checks,unanswered,failures,critical_failures,score_pct,verdict from store.scorecard order by code',
 'repeat-failures':'select * from store.repeat_failures order by failed_visits desc,site,check_code',
 actions:'select code,site,audit,check_code,title,owner,due_date,state,revisit_on from store.action_register order by due_date,code',
 'overdue-actions':"select code,site,title,owner,due_date,state from store.action_register where state<>'verified' and due_date<current_date order by due_date,code",
 revisits:"select code,site,title,owner,revisit_on,state from store.action_register where revisit_on is not null and state<>'verified' order by revisit_on,code",
 coverage:'select code,name,owner,last_visit,next_visit,coverage from store.coverage order by code',
 compliance:'select * from store.compliance_findings order by rule,site,reference',
 evidence:'select e.code,a.code audit,c.code check_code,e.reference,e.personal,e.purpose,e.access_owner,e.review_on from store.evidence e join store.checks c on c.id=e.check_id join store.audits a on a.id=c.audit_id order by e.code',
 history:'select entity,operation,actor,reason,record_id,created_at from store.activity order by created_at desc,id limit 100',
 imports:'select source,file_hash,row_count,actor,created_at from store.import_batches order by created_at desc',
 attention:"select 'Visit overdue' kind,a.code reference,s.name site,a.auditor owner,a.due_date due from store.audits a join store.sites s on s.id=a.site_id where a.status='planned' and a.due_date<current_date union all select 'Action overdue',code,site,owner,due_date from store.action_register where state<>'verified' and due_date<current_date order by due,reference"
};
const SPECS={help:[],audit:['audit'],checks:['audit'],'add-site':['code','name','region','owner','country','cadence'],'add-standard':['code','section','question','weight','critical'],'retire-standard':['standard','reason'],'plan-audit':['code','site','title','auditor','due'],'record-check':['audit','check','outcome','note'],'submit-audit':['audit','visited'],'add-action':['code','audit','check','title','owner','due','revisit'],'complete-action':['action','resolution','evidence'],'verify-action':['action','reason'],'reopen-action':['action','reason'],'attach-evidence':['code','audit','check','reference','personal','purpose','owner','review'],'review-evidence':['evidence','purpose','owner','review','reason'],log:['note'],import:['file','source','answers','map','dry-run'],export:['file'],'weekly-review':[],'draft-review':[],'draft-visit':['audit']};
export const COMMANDS=[...Object.keys(READS),...Object.keys(SPECS)];
const WRITES=new Set(['add-site','add-standard','retire-standard','plan-audit','record-check','submit-audit','add-action','complete-action','verify-action','reopen-action','attach-evidence','review-evidence','log','import']);
const BOOL=new Set(['json','critical','personal','dry-run']);
const required=(o,k)=>{if(typeof o[k]!=='string'||!o[k].trim())throw Error(`--${k} is required`);return o[k].trim()};
const day=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)throw Error(`Invalid calendar date: ${v}`);return v};
const int=(v,min,max)=>{if(!/^\d+$/.test(String(v))||!Number.isSafeInteger(Number(v))||Number(v)<min||Number(v)>max)throw Error(`Expected integer ${min}..${max}: ${v}`);return Number(v)};
const hash=x=>createHash('sha256').update(x).digest('hex');
const stable=x=>x&&typeof x==='object'?(Array.isArray(x)?x.map(stable):Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])]))):x;
const fingerprint=x=>hash(JSON.stringify(stable(x)));
function parse(args){const cmd=args[0]||'help',opts={},pos=[];if(!COMMANDS.includes(cmd))throw Error(`Unknown command ${cmd}`);for(const a of args.slice(1)){if(!a.startsWith('--')){pos.push(a);continue}const at=a.indexOf('='),k=a.slice(2,at<0?undefined:at),v=at<0?true:a.slice(at+1);if(!['json','actor',...(SPECS[cmd]||[])].includes(k))throw Error(`Unknown option --${k}`);if(k in opts)throw Error(`Duplicate option --${k}`);if(BOOL.has(k)&&v!==true)throw Error(`--${k} is a flag without a value`);opts[k]=v;}if(cmd==='import'){if(pos.join(' ')!=='goaudits')throw Error('Use import goaudits')}else if(pos.length)throw Error('Unexpected positional arguments');return {cmd,o:opts}}
async function resolve(db,t,input){if(!['sites','standards','audits','actions','evidence'].includes(t))throw Error('Invalid record type');let rows=await db.query(`select * from store.${t} where lower(code)=lower($1) or id::text=$1`,[input]);if(!rows.length){const label=t==='sites'?'name':t==='standards'?'question':t==='evidence'?'reference':'title';rows=await db.query(`select * from store.${t} where left(id::text,length($1))=$1 or strpos(lower(code),lower($1))>0 or strpos(lower(${label}),lower($1))>0 order by code`,[input]);}if(rows.length!==1)throw Error(rows.length?`Ambiguous ${t}: ${rows.map(r=>r.code+' '+r.id).join(', ')}`:`No ${t} matching ${input}`);return rows[0]}
async function check(db,o){const a=await resolve(db,'audits',required(o,'audit'));const rows=await db.query('select * from store.checks where audit_id=$1 and lower(code)=lower($2)',[a.id,required(o,'check')]);if(rows.length!==1)throw Error('Check code not found for this audit');return {a,c:rows[0]}}
async function insert(db,t,values){const keys=Object.keys(values);return (await db.query(`insert into store.${t} (${keys.join(',')}) values (${keys.map((_,i)=>'$'+(i+1)).join(',')}) returning *`,Object.values(values)))[0]}
async function change(db,t,id,values){const keys=Object.keys(values);return (await db.query(`update store.${t} set ${keys.map((k,i)=>k+'=$'+(i+2)).join(',')} where id=$1 returning *`,[id,...Object.values(values)]))[0]}
async function weekly(db){return {visits:await db.query(READS['visit-plan']),scores:await db.query(READS.scorecard),repeat_failures:await db.query(READS['repeat-failures']),attention:await db.query(READS.attention)}}
function writeNew(file,content){const abs=path.resolve(file);fs.mkdirSync(path.dirname(abs),{recursive:true,mode:0o700});fs.writeFileSync(abs,content,{flag:'wx',mode:0o600});return abs}
export function pretty(v){if(Array.isArray(v)){if(!v.length)return '(none)';const cols=Object.keys(v[0]);return table(v,cols.map(k=>({key:k,label:k,format:x=>x===null?'':typeof x==='object'?JSON.stringify(x):String(x)})))}return JSON.stringify(v,null,2)}
async function importGoAudits(db,o){
 const file=required(o,'file'),source=required(o,'source'),content=fs.readFileSync(file,'utf8');
 if(!/^[a-zA-Z0-9_-]+$/.test(source))throw Error('Source must be a stable account code with letters, digits, underscores or hyphens');
 let rows=/\.csv$/i.test(file)?parseCsv(content):JSON.parse(content);if(!Array.isArray(rows)||!rows.length)throw Error('Export must contain a nonempty row array');
 const map=o.map?JSON.parse(fs.readFileSync(required(o,'map'),'utf8')):{};
 const answers=o.answers?JSON.parse(fs.readFileSync(required(o,'answers'),'utf8')):{};
 if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.values(answers).some(x=>!['pass','fail','na'].includes(x)))throw Error('Answer map values must be pass, fail or na');
 const seen=new Set();let added=0,unchanged=0,batch;
 for(const raw of rows){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Invalid export row');
  const d={...(raw.auditDetails||raw)};for(const [dest,heading] of Object.entries(map)){if(!(heading in d))throw Error(`Missing mapped heading ${heading}`);d[dest]=d[heading];}
  const need=k=>{if(d[k]===null||d[k]===undefined||String(d[k]).trim()==='')throw Error(`Export row missing ${k}`);return String(d[k]).trim()};
  const account=need('clientId'),aid=need('id'),lid=need('locationId'),qid=d.questionId?String(d.questionId):need('questionNumber');
  const key=JSON.stringify([source,account,aid,d.section||'',d.groupName||'',qid]);if(seen.has(key))throw Error('Duplicate source key in file');seen.add(key);
  const fp=fingerprint({raw,map,answers});const old=await db.query('select fingerprint from store.source_rows where source_key=$1',[key]);if(old.length){if(old[0].fingerprint!==fp)throw Error('Changed source key: review correction before replacing imported history');unchanged++;continue;}
  const date=day(need('date')),question=need('question'),name=need('name'),siteName=need('location');
  if(!batch)batch=await insert(db,'import_batches',{source,file_hash:hash(content),row_count:rows.length,actor:required(o,'actor')});
  const siteCode=`IMP-${hash(JSON.stringify([source,account,lid])).slice(0,20)}`;
  let site=(await db.query('select * from store.sites where code=$1',[siteCode]))[0];if(!site)site=await insert(db,'sites',{code:siteCode,name:siteName,region:'Import review',owner:'Assign owner',country:'OTHER'});
  const auditKey=JSON.stringify([source,account,aid]);let audit=(await db.query('select * from store.audits where source_key=$1',[auditKey]))[0];
  if(!audit)audit=await insert(db,'audits',{code:`IMP-${hash(auditKey).slice(0,20)}`,site_id:site.id,title:name,auditor:String(d.auditor||'Review source'),due_date:date,visited_on:date,status:'imported',source_key:auditKey});
  else if(audit.site_id!==site.id||audit.visited_on!==date||audit.title!==name)throw Error('Inconsistent audit identity within source');
  const outcome=answers[String(d.answer)]||null;
  const code=`IMP-${hash(JSON.stringify([source,account,d.auditTypeId||name,d.section||'',d.groupName||'',qid,question])).slice(0,20)}`;
  const c=await insert(db,'checks',{audit_id:audit.id,code,section:String(d.section||'Imported'),question,weight:1,critical:false,outcome,note:String(d.comments||''),source_key:key});
  await insert(db,'source_rows',{source_key:key,batch_id:batch.id,check_id:c.id,raw:JSON.stringify(raw),fingerprint:fp});added++;
 }
 return {source,added,unchanged,unmapped_answers:'Use compliance to review imported answers. Native scores are preserved in source_rows only.',dry_run:Boolean(o['dry-run'])};
}
async function execute(db,cmd,o){
 if(cmd in READS)return db.query(READS[cmd]);
 if(cmd==='help')return {commands:COMMANDS,arguments:SPECS,mutations:'Require --actor. import accepts --dry-run. See docs/cli.md.'};
 if(cmd==='audit'||cmd==='checks'){const a=await resolve(db,'audits',required(o,'audit'));const rows=await db.query('select code,section,question,weight,critical,outcome,note from store.checks where audit_id=$1 order by section,code',[a.id]);return cmd==='checks'?rows:{audit:a,checks:rows,actions:await db.query('select * from store.action_register where audit=$1',[a.code])};}
 if(cmd==='add-site')return insert(db,'sites',{code:required(o,'code'),name:required(o,'name'),region:required(o,'region'),owner:required(o,'owner'),country:required(o,'country'),cadence_days:int(o.cadence||30,1,3650)});
 if(cmd==='add-standard')return insert(db,'standards',{code:required(o,'code'),section:required(o,'section'),question:required(o,'question'),weight:int(required(o,'weight'),1,100),critical:Boolean(o.critical)});
 if(cmd==='retire-standard'){required(o,'reason');const s=await resolve(db,'standards',required(o,'standard'));return change(db,'standards',s.id,{active:false})}
 if(cmd==='plan-audit'){
  const s=await resolve(db,'sites',required(o,'site'));const standards=await db.query('select * from store.standards where active order by code');if(!standards.length)throw Error('No active checklist standards');
  const a=await insert(db,'audits',{code:required(o,'code'),site_id:s.id,title:required(o,'title'),auditor:required(o,'auditor'),due_date:day(required(o,'due'))});
  for(const c of standards)await insert(db,'checks',{audit_id:a.id,standard_id:c.id,code:c.code,section:c.section,question:c.question,weight:c.weight,critical:c.critical});return {code:a.code,id:a.id,checks:standards.length};
 }
 if(cmd==='record-check'){
  const {a,c}=await check(db,o);if(a.status!=='planned')throw Error('Only planned audits accept responses');const outcome=required(o,'outcome');if(!['pass','fail','na'].includes(outcome))throw Error('Outcome must be pass, fail or na');
  const note=outcome==='pass'?String(o.note||''):required(o,'note');if(outcome!=='fail'&&(await db.query('select id from store.actions where check_id=$1',[c.id])).length)throw Error('Check has action history; record correction in a new audit');
  return change(db,'checks',c.id,{outcome,note});
 }
 if(cmd==='submit-audit'){
  const a=await resolve(db,'audits',required(o,'audit'));if(a.status!=='planned')throw Error('Audit already submitted or imported');const visited=day(required(o,'visited'));if(visited>new Date().toISOString().slice(0,10))throw Error('Visit date cannot be in the future');
  const rows=await db.query('select * from store.checks where audit_id=$1',[a.id]);if(!rows.length||rows.some(c=>!c.outcome))throw Error('Every check must have an answer');
  for(const c of rows.filter(c=>c.outcome==='fail'))if(!(await db.query('select id from store.actions where check_id=$1',[c.id])).length)throw Error(`Failed check ${c.code} needs an action`);
  return change(db,'audits',a.id,{status:'submitted',visited_on:visited});
 }
 if(cmd==='add-action'){
  const {c}=await check(db,o);if(c.outcome!=='fail')throw Error('Actions require a failed check');return insert(db,'actions',{code:required(o,'code'),check_id:c.id,title:required(o,'title'),owner:required(o,'owner'),due_date:day(required(o,'due')),revisit_on:o.revisit?day(required(o,'revisit')):null});
 }
 if(cmd==='complete-action'){
  const a=await resolve(db,'actions',required(o,'action'));if(a.state!=='open')throw Error('Action must be open');const e=await resolve(db,'evidence',required(o,'evidence'));if(e.check_id!==a.check_id)throw Error('Evidence belongs to another check');
  return change(db,'actions',a.id,{state:'completed',resolution:required(o,'resolution'),evidence_id:e.id,completed_by:required(o,'actor')});
 }
 if(cmd==='verify-action'){
  required(o,'reason');const a=await resolve(db,'actions',required(o,'action'));if(a.state!=='completed')throw Error('Action must be completed first');if(a.completed_by.toLowerCase()===o.actor.trim().toLowerCase())throw Error('A different reviewer must verify');
  return change(db,'actions',a.id,{state:'verified',verified_by:required(o,'actor')});
 }
 if(cmd==='reopen-action'){
  required(o,'reason');const a=await resolve(db,'actions',required(o,'action'));if(a.state==='open')throw Error('Action is already open');return change(db,'actions',a.id,{state:'open',resolution:null,evidence_id:null,completed_by:null,verified_by:null});
 }
 if(cmd==='attach-evidence'){
  const {c}=await check(db,o);return insert(db,'evidence',{code:required(o,'code'),check_id:c.id,reference:required(o,'reference'),personal:Boolean(o.personal),purpose:required(o,'purpose'),access_owner:required(o,'owner'),review_on:day(required(o,'review'))});
 }
 if(cmd==='review-evidence'){
  required(o,'reason');const e=await resolve(db,'evidence',required(o,'evidence'));return change(db,'evidence',e.id,{purpose:required(o,'purpose'),access_owner:required(o,'owner'),review_on:day(required(o,'review'))});
 }
 if(cmd==='log')return insert(db,'activity',{entity:'note',operation:'NOTE',actor:required(o,'actor'),reason:required(o,'note')});
 if(cmd==='import')return importGoAudits(db,o);
 if(cmd==='export'){
  const data={format:'store-audits/v1',exported_at:new Date().toISOString(),records:{}};for(const t of ['sites','standards','audits','checks','evidence','actions','import_batches','source_rows','activity'])data.records[t]=await db.query(`select * from store.${t} order by id`);
  return {file:writeNew(required(o,'file'),JSON.stringify(data,null,2)+'\n'),record_sets:Object.keys(data.records).length};
 }
 if(cmd==='weekly-review')return weekly(db);
 if(cmd==='draft-review'||cmd==='draft-visit'){
  const v=cmd==='draft-review'?await weekly(db):await execute(db,'audit',o);const text=`# ${cmd==='draft-review'?'Store operations review':'Store visit brief'}\n\nDraft for human review. Nothing sent.\n\n`+Object.entries(v).map(([k,rows])=>`## ${k.replaceAll('_',' ')}\n\n\`\`\`text\n${pretty(rows)}\n\`\`\``).join('\n\n')+'\n';
  const file=path.join(process.env.OUTPUT_DIR||REPO_ROOT,'drafts',`${cmd}-${Date.now()}-${createHash('sha256').update(text).digest('hex').slice(0,8)}.md`);return {file:writeNew(file,text),sent:false};
 }
 throw Error('Unknown command');
}
export async function run(db,args){const {cmd,o}=parse(args);const write=WRITES.has(cmd);if(write)required(o,'actor');await db.exec(write?'BEGIN':'BEGIN READ ONLY');try{if(write){await db.query("select set_config('store.actor',$1,true),set_config('store.reason',$2,true)",[o.actor.trim(),String(o.reason||cmd)]);}const result=await execute(db,cmd,o);await db.exec(o['dry-run']?'ROLLBACK':'COMMIT');return result;}catch(e){await db.exec('ROLLBACK');throw e}}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){let db;try{db=await getDb();const result=await run(db,process.argv.slice(2));console.log(process.argv.includes('--json')?JSON.stringify(result):pretty(result));}catch(e){console.error(e.message);process.exitCode=1}finally{if(db)await db.close()}}
