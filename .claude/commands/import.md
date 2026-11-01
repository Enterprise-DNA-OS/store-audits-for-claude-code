---
description: import for store audit operations
---

# import

Read docs/replace-goaudits.md. Inspect the original file and mapping. Run the dry preview first and reconcile counts. Apply only after the operator asks for import. Do not fetch vendor credentials.

Use this shape and substitute the operator's values:

```bash
npm run audit -- import goaudits --file=fixtures/goaudits-details.json --source=demo-account --answers=fixtures/answers.json --dry-run --actor="Your name"
```

For fields and constraints, read docs/cli.md. Use --json for analysis. Keep private records and generated reports out of Git.
