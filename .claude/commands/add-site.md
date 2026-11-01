---
description: add site for store audit operations
---

# add site

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- add-site --code=CHC --name="Christchurch Store" --region=South --owner=Manager --country=NZ --cadence=30 --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
