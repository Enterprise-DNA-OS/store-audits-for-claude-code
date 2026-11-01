# Store Audits for Claude Code

For regional managers of general merchandise stores reviewing visits, standards and corrective work. The bundled business and records are fictional. Fill in the business name and operator in brand.json and your own local notes.

Read before writing. Every answer starts with fresh CLI output. Use npm run audit -- help to see supported arguments. All mutations use this CLI; never bypass its validation with a direct update. Use the operator's real attribution label. A separate verifier must review completed work.

| Job | Recipe |
|---|---|
| sites | /sites |
| standards | /standards |
| audits | /audits |
| visit plan | /visit-plan |
| scorecard | /scorecard |
| repeat failures | /repeat-failures |
| actions | /actions |
| overdue actions | /overdue-actions |
| revisits | /revisits |
| coverage | /coverage |
| compliance | /compliance |
| evidence | /evidence |
| history | /history |
| imports | /imports |
| attention | /attention |
| help | /help |
| audit | /audit |
| checks | /checks |
| add site | /add-site |
| add standard | /add-standard |
| retire standard | /retire-standard |
| plan audit | /plan-audit |
| record check | /record-check |
| submit audit | /submit-audit |
| add action | /add-action |
| complete action | /complete-action |
| verify action | /verify-action |
| reopen action | /reopen-action |
| attach evidence | /attach-evidence |
| review evidence | /review-evidence |
| log | /log |
| import | /import |
| export | /export |
| weekly review | /weekly-review |
| draft review | /draft-review |
| draft visit | /draft-visit |
| Add a field or rule | /customise |
| Add a read-only report | /new-view |

Never send emails, messages, automatic notifications or payments. Drafts stay in drafts/. Never delete business records or evidence without the operator's specific instruction and a backup. Do not invent source data, answers, evidence or approvals. List ambiguous matches and ask for the right one.

A planned visit snapshots active standards. A submitted visit cannot change its answers. A correction is a new visit. Imported history retains source fields, with explicit answer mappings and a separate score basis. Read docs/replace-goaudits.md before importing.

Compliance output is a review list, not a certification. Read docs/compliance.md before interpreting it. Personal evidence needs a purpose, access owner and review date. The CLI cannot check a photo or file's actual access settings.

The schema is in supabase/migrations, recurring recipes in .claude/commands, and the CLI is scripts/audit.mjs. Local PGlite is single-process. DATABASE_URL selects Postgres. Do not share an owner connection with untrusted users. Keep personal data, exports and generated reports out of Git.

Enterprise DNA can customise and operate this through Omni by Enterprise DNA. https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=goaudits&utm_medium=instructions
