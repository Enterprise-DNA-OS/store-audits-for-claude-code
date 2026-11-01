# CLI reference

Every command supports --json. Use name fragments, exact codes or UUID prefixes for record selections. Ambiguous selections list candidates and exit 1. Check codes are exact within an audit. No command sends a message or initiates a payment.

Writes need --actor="Your name". This is an attribution label, not authentication. Unknown and duplicate flags are rejected. Dates are ISO calendar dates. Booleans are flags without a value. A flag such as --dry-run=false is rejected.

Examples are command shapes, not a script to run in order. Substitute the selected record and dates.

## sites

```bash
npm run audit -- sites
```

## standards

```bash
npm run audit -- standards
```

## audits

```bash
npm run audit -- audits
```

## visit-plan

```bash
npm run audit -- visit-plan
```

## scorecard

```bash
npm run audit -- scorecard
```

## repeat-failures

```bash
npm run audit -- repeat-failures
```

## actions

```bash
npm run audit -- actions
```

## overdue-actions

```bash
npm run audit -- overdue-actions
```

## revisits

```bash
npm run audit -- revisits
```

## coverage

```bash
npm run audit -- coverage
```

## compliance

```bash
npm run audit -- compliance
```

## evidence

```bash
npm run audit -- evidence
```

## history

```bash
npm run audit -- history
```

## imports

```bash
npm run audit -- imports
```

## attention

```bash
npm run audit -- attention
```

## help

```bash
npm run audit -- help
```

## audit

```bash
npm run audit -- audit --audit=WGN-LATEST
```

## checks

```bash
npm run audit -- checks --audit=AKL-NEXT
```

## add-site

```bash
npm run audit -- add-site --code=CHC --name="Christchurch Store" --region=South --owner=Manager --country=NZ --cadence=30 --actor="Your name"
```

## add-standard

```bash
npm run audit -- add-standard --code=RETURNS --section=Service --question="Returns information is displayed" --weight=2 --actor="Your name"
```

## retire-standard

```bash
npm run audit -- retire-standard --standard=RETURNS --reason="Replaced by a reviewed revision" --actor="Your name"
```

## plan-audit

```bash
npm run audit -- plan-audit --code=CHC-001 --site=CHC --title="Monthly store visit" --auditor=Inspector --due=2026-11-15 --actor="Your name"
```

## record-check

```bash
npm run audit -- record-check --audit=AKL-NEXT --check=PRICE --outcome=fail --note="Shelf label differs from checkout" --actor="Your name"
```

## submit-audit

```bash
npm run audit -- submit-audit --audit=AKL-NEXT --visited=2026-11-01 --actor="Your name"
```

## add-action

```bash
npm run audit -- add-action --code=AKL-PRICE --audit=AKL-NEXT --check=PRICE --title="Correct shelf label" --owner=Manager --due=2026-11-03 --revisit=2026-11-04 --actor="Your name"
```

## complete-action

```bash
npm run audit -- complete-action --action=FIX-PRICE --resolution="Price checked again" --evidence=PHOTO-1 --actor="Your name"
```

## verify-action

```bash
npm run audit -- verify-action --action=FIX-PRICE --reason="Evidence and result reviewed" --actor="Your name"
```

## reopen-action

```bash
npm run audit -- reopen-action --action=FIX-PRICE --reason="Correction needs another visit" --actor="Your name"
```

## attach-evidence

```bash
npm run audit -- attach-evidence --code=AKL-PHOTO --audit=AKL-NEXT --check=PRICE --reference="archive:label-check" --purpose="Verify shelf label" --owner=Manager --review=2027-01-01 --actor="Your name"
```

## review-evidence

```bash
npm run audit -- review-evidence --evidence=PHOTO-1 --purpose="Open price correction" --owner=Manager --review=2027-01-01 --reason="Purpose and access reviewed" --actor="Your name"
```

## log

```bash
npm run audit -- log --note="Regional review completed" --actor="Your name"
```

## import

```bash
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --dry-run --actor="Your name"
```

## export

```bash
npm run audit -- export --file=exports/store-records.json
```

## weekly-review

```bash
npm run audit -- weekly-review
```

## draft-review

```bash
npm run audit -- draft-review
```

## draft-visit

```bash
npm run audit -- draft-visit --audit=AKL-NEXT
```
