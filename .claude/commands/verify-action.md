---
description: verify action for store audit operations
---

# verify action

Read the action and evidence. A reviewer different from the completing actor must verify. Never invent a reviewer label to pass the check.

Use this shape and substitute the operator's values:

```bash
npm run audit -- verify-action --action=FIX-PRICE --reason="Evidence and result reviewed" --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
