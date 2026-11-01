---
description: retire standard for store audit operations
---

# retire standard

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- retire-standard --standard=RETURNS --reason="Replaced by a reviewed revision" --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
