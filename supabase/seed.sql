begin;
select set_config('store.actor','Fictional demo seed',true);
insert into store.sites(id,code,name,region,owner,country,cadence_days) values
('10000000-0000-0000-0000-000000000001','WGN','Harbour Homewares Wellington','Lower North','Aroha','NZ',30),
('10000000-0000-0000-0000-000000000002','AKL','Harbour Homewares Auckland','Upper North','Matiu','NZ',30),
('10000000-0000-0000-0000-000000000003','SYD','Harbour Homewares Sydney','NSW','Casey','AU',30) on conflict do nothing;
insert into store.standards(id,code,section,question,weight,critical) values
('20000000-0000-0000-0000-000000000001','PRICE','Merchandising','Shelf price matches the checkout price',3,true),
('20000000-0000-0000-0000-000000000002','DISPLAY','Presentation','Current promotion is displayed correctly',2,false),
('20000000-0000-0000-0000-000000000003','HANDOVER','Store routine','Shift handover record is complete',1,false) on conflict do nothing;
insert into store.audits(id,code,site_id,title,auditor,due_date,visited_on,status) values
('30000000-0000-0000-0000-000000000001','WGN-OLD','10000000-0000-0000-0000-000000000001','Previous store visit','Taylor',current_date-65,current_date-65,'submitted'),
('30000000-0000-0000-0000-000000000002','WGN-LATEST','10000000-0000-0000-0000-000000000001','Latest store visit','Taylor',current_date-35,current_date-35,'submitted'),
('30000000-0000-0000-0000-000000000003','AKL-NEXT','10000000-0000-0000-0000-000000000002','Auckland visit','Jordan',current_date-2,null,'planned') on conflict do nothing;
insert into store.checks(id,audit_id,standard_id,code,section,question,weight,critical,outcome,note)
select ('40000000-0000-0000-0000-'||lpad((row_number() over(order by a.code,s.code))::text,12,'0'))::uuid,a.id,s.id,s.code,s.section,s.question,s.weight,s.critical,case when a.status='planned' then null when s.code='PRICE' then 'fail' else 'pass' end,case when s.code='PRICE' then 'Fictional shelf label differs from checkout record' else '' end
from store.audits a cross join store.standards s where a.code in ('WGN-OLD','WGN-LATEST','AKL-NEXT') and s.code in ('PRICE','DISPLAY','HANDOVER') on conflict do nothing;
insert into store.evidence(id,code,check_id,reference,personal,purpose,access_owner,review_on)
select '50000000-0000-0000-0000-000000000001','PHOTO-1',c.id,'demo:price-label-record',true,'Resolve shelf price discrepancy','Regional operations',current_date-5 from store.checks c join store.audits a on a.id=c.audit_id where a.code='WGN-LATEST' and c.code='PRICE' on conflict do nothing;
insert into store.actions(id,code,check_id,title,owner,due_date,revisit_on)
select '60000000-0000-0000-0000-000000000001','FIX-PRICE',c.id,'Replace label and verify checkout price','Aroha',current_date-7,current_date+2 from store.checks c join store.audits a on a.id=c.audit_id where a.code='WGN-LATEST' and c.code='PRICE' on conflict do nothing;
commit;
