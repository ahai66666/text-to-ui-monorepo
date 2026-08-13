# Component Source Resolution

Use the generated component index to locate candidates, then read only the exact selected entries in `packages/component-contracts/src/components.json`.

## Mandatory order

1. Import a real component from `@text-to-ui/components-html`, `@text-to-ui/components-react`, or `@text-to-ui/components-vue` when the target framework source exists.
2. When the library lacks the capability, implement from the matching canonical contract and record `matching-contract`.
3. Only when both searches miss, compose page-owned UI with shared Tokens, semantic icons, and HarmonyOS PC rules; record `custom` plus miss evidence.

Lookalike markup, copied DOM/CSS, screenshots, `data-component`, or matching class names do not count as component reuse. Patterns and domain compositions are allowed to arrange components but must not recreate component internals.

Query example:

```bash
node text-to-ui/scripts/query-components.mjs \
  --framework react \
  --capabilities search,checkbox,list-item,tooltip
```
