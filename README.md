# Store Audits for Claude Code

Find the store that failed the same check twice, the visit nobody completed and the correction that still needs proof. Keep store standards and visit history in a database you own.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free, MIT licensed. Install the fictional retail week. | Your checklists, scoring, evidence rules and GoAudits mapping. | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. |
| [Quick start](#quick-start) | [Get your version built](https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=goaudits&utm_medium=customise) | [Book a call](https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=goaudits&utm_medium=managed) |

For regional managers of general merchandise stores. Runs with Claude Code, Codex, OpenCode or Cursor. GoAudits is a broader mobile inspection platform. This base covers fixed checklists, visit planning, evidence references and corrective work. [Scope and research](docs/research.md).

## Quick start

Node 20 or later, Windows or Linux:

```bash
git clone https://github.com/Enterprise-DNA-OS/store-audits-for-claude-code.git
cd store-audits-for-claude-code
npm install
npm run demo
npm test
npm run view
npm run docs
```

The demo is fictional. Wellington has two failed shelf-price checks, Auckland has an overdue visit, and Sydney has no recorded visit. Evidence needs review and one correction is overdue. Repeating the seed does not overwrite your changes.

PGlite stores the local database in .data/db. DATABASE_URL selects Postgres. Use a fresh DATA_DIR or a new database for business records, migrate it and import your records. Do not seed fictional data into your business database. Local PGlite runs one process at a time.

## Five recurring jobs

1. /visit-plan: prepare the regional visit list and identify missed appointments.
2. /scorecard: review unanswered checks, weighted results and critical failures.
3. /repeat-failures: find the same standard failing on separate visits.
4. /overdue-actions: chase corrections that are still open or awaiting verification.
5. /weekly-review: combine visit coverage, scores, repeat problems and assigned work.

36 CLI commands and 38 slash recipes are included. Every CLI command supports --json. [Arguments and examples](docs/cli.md).

## Ten questions answered today

GoAudits also offers reporting and trends. These are questions this build answers from its own records, not a claim that the incumbent cannot answer them.

| Question | Command |
|---|---|
| Which planned visits are overdue and who owns them? | attention |
| Which stores have never had a recorded visit? | coverage |
| Where did the same check fail on separate visits? | repeat-failures |
| Which scores contain a critical failure? | scorecard |
| Which visits still have unanswered questions? | scorecard |
| Which corrections are completed but still unverified? | actions |
| Which corrections have a revisit date? | revisits |
| Which evidence references need a purpose and retention review? | compliance |
| Which imported answers still need a reviewed mapping? | compliance |
| Who changed an action, and what reason did they record? | history |

## A visit through to verification

Plan a visit to snapshot all active standards. Record pass, fail or not-applicable for each check. Failed and not-applicable answers need a note. Every failed answer needs an assigned corrective action before the visit can be submitted.

Local scores divide passed weights by answered applicable weights. Not-applicable answers are excluded. Unanswered audits stay labelled Incomplete. A critical failure is shown regardless of the percentage. An all-not-applicable checklist has no numeric score. Imported history has no locally calculated score; the vendor's values stay in the retained source record.

Attach an evidence reference with its purpose, access owner and review date. Complete the action with a resolution and evidence belonging to that same check. A different reviewer verifies it. Reopen it with a reason when the correction fails. Submitted answers and original import rows remain unchanged. A later observation belongs in a new visit.

The actor label records attribution but does not authenticate the person. Database owners are trusted administrators. A shared installation needs proper identity, scoped roles, private storage and tested recovery.

## Bring your GoAudits history

```bash
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --actor="Import reviewer" --dry-run
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --actor="Import reviewer"
```

The fixture follows the documented audit-details JSON structure. Workbook exports need the question-level sheet saved as CSV UTF-8, with headings mapped and dates checked. The whole import succeeds or rolls back. Unmapped answer labels are flagged, and changed source keys are rejected. Original scores and extra source fields are preserved. [Export, mapping and reconciliation guide](docs/replace-goaudits.md).

The free base does not fetch photos, copy notifications, migrate action-plan history or reproduce conditional forms. Enterprise DNA scopes those needs when building your version. Retain the original exports and check a representative store before switching.

## Your first hour: ten things to ask for

1. Put our business name and logo on every store report.
2. Show which stores have never been visited.
3. Prepare the next regional visit list.
4. Explain why a critical failure remains visible beside the score.
5. Find the same price check failing twice.
6. Draft a visit brief without sending it.
7. Show who is responsible for overdue corrections.
8. Review the purpose and access owner for a photo reference.
9. Add a merchandising standard through /customise.
10. Preview a source export, inspect the answer mapping and reconcile the row count.

## Documents and views

npm run docs renders store visit reports, corrective action records and evidence review registers as branded HTML. npm run view renders the store week and corrective-work dashboards. Edit brand.json for your own name, logo and colours. These are read-only files that print to PDF, with no server to run. [What mobile screens add](docs/why-no-front-end.md).

The compliance command checks recorded price discrepancies, overdue evidence reviews, unanswered imports and gaps in corrective work. [Sources, internal policies and limits](docs/compliance.md). These checks are not legal certification and do not inspect the physical shop or the actual evidence file.

## Tests and operation

npm test uses a temporary database, runs every command and tests scoring, required answers, immutable snapshots, evidence linkage, reviewer separation, atomic imports, replay protection, CSV handling, JSON output and HTML escaping. TEST_DATABASE_URL optionally selects a fresh disposable Postgres database. The CI workflow runs Windows and Linux plus a Postgres job. See docs/validation.md for completed runs.

export writes all nine record sets to a new JSON file and refuses to overwrite one. This is an interchange snapshot, not an automatic restore. Back up the database and referenced evidence separately. Exported personal data, imports and generated reports stay out of Git.

MIT licensed. Not affiliated with GoAudits or Anthropic. Hosting, agent subscriptions and operation have separate costs. [Book 30 minutes with Sam](https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=goaudits&utm_medium=readme).
