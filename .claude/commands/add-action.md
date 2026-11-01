---
description: add action for store audit operations
---

# add action

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- add-action --code=AKL-PRICE --audit=AKL-NEXT --check=PRICE --title="Correct shelf label" --owner=Manager --due=2026-11-03 --revisit=2026-11-04 --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
