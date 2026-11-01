---
description: reopen action for store audit operations
---

# reopen action

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- reopen-action --action=FIX-PRICE --reason="Correction needs another visit" --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
