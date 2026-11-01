---
description: add standard for store audit operations
---

# add standard

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- add-standard --code=RETURNS --section=Service --question="Returns information is displayed" --weight=2 --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
