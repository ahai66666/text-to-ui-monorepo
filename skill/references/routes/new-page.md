# New page or redesign route

Run Gate 0 from `SKILL.md`, then read only:

1. `references/requirement-spec.md`
2. the Context Packet's `exactReferencesToRead`
3. exact selected entries from `packages/component-contracts/src/components.json`

After confirmation:

```bash
node scripts/locate-monorepo.mjs --start "$PWD"
node scripts/resolve-context.mjs --task <task> --framework <html|react|vue> --mode fast-preview --confirmed --out <context-packet.json>
node scripts/generate-layout-contract.mjs --context <context-packet.json> --out <layout-contract.json>
node scripts/validate-pc-framework-layout.mjs --contract <layout-contract.json>
node scripts/generate-framework-page.mjs --context <context-packet.json> --layout-contract <layout-contract.json> --bindings <page-bindings.json> --out <page-module> --manifest <framework-page-manifest.json>
```

Resolve components in framework component → canonical contract → Token-based
custom order. HTML, React, and Vue must use the renderer contract returned by
the Context Packet and must retain the same Pattern/structure digests. HTML may
also emit the strict component-usage evidence manifest. Start managed services,
show the first interactive preview, and pause for approval before release
validation or Pixso refinement.

Do not use this route merely to import an already approved HTML page unchanged.
