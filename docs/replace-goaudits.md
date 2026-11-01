# Bring GoAudits history across

1. Keep your original account and exports. Ask an authorised account administrator for the audit details response from GoAudits' documented getauditdetails or getauditdetailsbyid read operation. Save the returned JSON array locally. This project never handles vendor credentials or calls its API.
2. The documented Export Audit Details operation also returns a workbook when file_type is EXCEL. Save the audit detail worksheet as CSV UTF-8. Inspect its column headings and dates. It must contain one question per row, not a summary or section subtotal. Convert dates to YYYY-MM-DD. Never mix subtotal rows into a question import.
3. Preview the mapped import. Then repeat without --dry-run. One command imports all supported rows atomically:

```bash
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --actor="Migration reviewer" --dry-run
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --actor="Migration reviewer"
```

The fixture is fictional data in the documented response shape, not a real customer export. Native JSON accepts wrapped auditDetails records or the flat getupdatedauditdetails response. CSV accepts the same flattened field names. If headings differ, --map=imports/headings.json maps canonical keys to actual headings, for example {"clientId":"Company ID","locationId":"Location ID"}. A workbook itself is not accepted. Mapping must be checked against a representative export before any switch-in-a-day cutover.

Required fields: clientId, id, locationId, location, name, date, question, and either questionId or questionNumber. section and groupName distinguish repeated question numbers. Reject missing identifiers and duplicate question keys. Source account codes prevent collisions across accounts. The entire original row, including unknown columns and vendor scores, is retained. Photos and attachments are not downloaded.

Exact answer labels map through your reviewed answer dictionary to pass, fail or na. There is deliberately no default assumption that Yes is always good. An unmapped answer stays unanswered and is shown by compliance. Reimport with a different dictionary is treated as a changed source record and rejected. Resolve corrections with a reviewed migration, retaining provenance. Replaying identical content is safe and adds no duplicate rows. Any invalid row rolls back the entire file. --dry-run rolls back all database changes.

Local audit weights are not inferred from the vendor's scores. Imported scores remain in the raw source record, and the local scorecard labels that history as imported. Imported sites have country OTHER and an unassigned owner until a reviewed migration fills in the right details. A matching store name never silently joins two accounts. Imported checklist identifiers remain separate from newly authored local standards.

Not carried automatically: conditional checklist logic, media files, signed reports, action-plan history, schedules, permissions, email rules, GPS and offline state. Action exports require a separately scoped mapping. New actions can be recorded against imported failed checks. Keep the old exports available for those records.

Reconcile the number of audits, unique question rows, sites and source score values. Run compliance and inspect a sample report. Keep both systems during the acceptance period. Switch only after the owner has checked the fields, recurring jobs, evidence access and mobile collection needs. Export writes all nine local record sets as JSON; it is an interchange snapshot, not a restore tool. Back up the database and evidence files separately.
