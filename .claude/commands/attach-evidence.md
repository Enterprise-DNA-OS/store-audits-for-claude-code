---
description: attach evidence for store audit operations
---

# attach evidence

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- attach-evidence --code=AKL-PHOTO --audit=AKL-NEXT --check=PRICE --reference="archive:label-check" --purpose="Verify shelf label" --owner=Manager --review=2027-01-01 --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
