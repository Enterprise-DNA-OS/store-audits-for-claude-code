---
description: plan audit for store audit operations
---

# plan audit

Read the relevant records before acting. Report the result from the command. Never invent missing data.

Use this shape and substitute the operator's values:

```bash
npm run audit -- plan-audit --code=CHC-001 --site=CHC --title="Monthly store visit" --auditor=Inspector --due=2026-11-15 --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
