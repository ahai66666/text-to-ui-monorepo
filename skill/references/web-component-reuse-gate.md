# Web Component Reuse Gate

Use this gate for every generated HTML, React, or Vue page. Pixso fidelity and
Web component reuse are independent decisions: `fast visual import` may relax
Pixso instance requirements, but it never permits handwritten Web lookalikes.

## Required order

1. Locate the Monorepo root containing `pnpm-workspace.yaml`,
   `packages/component-contracts`, and the three framework component packages.
2. Run `pnpm delivery:validate` from that root.
3. Read `packages/component-contracts/src/components.json` before writing page
   code. Search by task, behavior, logical name, Variant, slots, and states.
4. Select exactly one Web renderer for the product page: HTML, React, or Vue.
5. Write `component-usage.json` next to the page specification. List every
   registered component used, its exact `logicalName`, and every page-owned
   exception.
6. Import the selected production package and its shared styles/Tokens in page
   source. Compose registered exports or factories; do not copy component DOM
   or CSS into the page.
7. Run `validate-web-component-reuse.mjs` before browser QA and delivery.

## Framework imports

- HTML: import runtime factories from `@text-to-ui/components-html` and load
  `@text-to-ui/components-html/styles.css` plus canonical Tokens.
- React: import components from `@text-to-ui/components-react` and load its
  shared styles plus canonical Tokens.
- Vue: import components from `@text-to-ui/components-vue` and load its shared
  styles plus canonical Tokens.

HTML-first means “use the production HTML renderer first.” It does not mean
“write a standalone imitation first.” A single-file delivery may be produced
only by bundling source that imported the production component package; the
editable source and component-usage evidence must remain in the delivery.

## What counts as reuse

Reuse is proven only when all of these are true:

- The exact registry `logicalName` is recorded in `component-usage.json`.
- The target framework has a real implementation path in the registry.
- Page source imports the matching `@text-to-ui/components-*` package.
- The rendered component carries the canonical contract attributes emitted by
  that adapter.
- Browser QA exercises the relevant state or interaction.

The following are markers only and never prove reuse by themselves:

- `data-component` or `data-logical-component` added by page code.
- A matching class name, copied DOM, copied CSS, screenshot, or old preview.
- A Pixso Frame with the same component name.
- A historical generated page that already looks correct.

## Page-owned exception

Create a page-owned component only when the registry has no component capable
of the required job after searching names, categories, behaviors, slots, and
Variants. Record each exception in `component-usage.json` with:

- a stable page-owned ID;
- the capability that is missing;
- the registry queries used;
- reviewed candidate logical names and why each is insufficient;
- whether the new implementation should remain page-owned or be promoted into
  the shared component library.

If the capability is reusable across products, add it to component contracts
and the selected framework package first, then consume it as a registered
component. Do not create local Button, Input, Search, Select, Picker, Alert,
Tooltip, Dialog, navigation item, or other registered primitive.

`partial` does not mean “ignore the component.” When `sourceReady` is true and
the selected framework implementation exists, use the real source and disclose
the unverified readiness dimensions. `partial` blocks claims of full parity; it
does not authorize a handwritten replacement. If the source or selected
framework implementation is genuinely missing, record a blocked gap and stop
rather than silently substituting a lookalike.

## Freshness rule

Do not inspect, copy, or extend a previous generated page as implementation
source unless the user explicitly asks to continue that artifact. Prior pages
may be used only as evidence when explicitly authorized. New requests start
from the confirmed requirements, current registry, current Tokens, and current
production adapters.

## Minimal manifest

```json
{
  "schemaVersion": 1,
  "targetFramework": "html",
  "registry": "packages/component-contracts/src/components.json",
  "sourceRoots": ["apps/example/src"],
  "registered": [
    {
      "logicalName": "Button/Primary/Default",
      "usage": "primary action"
    }
  ],
  "pageOwned": [],
  "previousOutputReuse": false
}
```

Validate it from the Monorepo root:

```bash
node text-to-ui/scripts/validate-web-component-reuse.mjs \
  --manifest /absolute/path/to/component-usage.json \
  --project-root /absolute/path/to/text-to-ui-monorepo
```
