---
description: record check for store audit operations
---

# record check

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- record-check --audit=AKL-NEXT --check=PRICE --outcome=fail --note="Shelf label differs from checkout" --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
