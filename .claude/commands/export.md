---
description: export for store audit operations
---

# export

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- export --file=exports/store-records.json
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
