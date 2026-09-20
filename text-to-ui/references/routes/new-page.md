# New page or redesign route

First locate the repository and discover the design inputs (no blueprint or
user confirmation is required for discovery). The route material closure is
part of the generation context; do not rely on a partial hand-picked list:

```bash
node scripts/locate-monorepo.mjs --start "$PWD"
node scripts/resolve-workflow-route.mjs --route new-page --repo <monorepo> --receipt-out <route-read-receipt.json>
node scripts/resolve-context.mjs --task <task> --framework <html|react|vue> --mode fast-preview --discover --out <design-context.json>
```

For an unknown task select an approved `--pattern` and explicit
`--capabilities` from the indexes. This selection is a model design decision,
not a reason to make the user choose routine implementation details.

Use the discovery packet to understand the actual Pattern and legal component
inputs before Gate 0 from `SKILL.md`, then read only:

1. `references/requirement-spec.md`
2. the discovery packet's `exactReferencesToRead` (read each reference once)
3. exact selected entries from `packages/component-contracts/src/components.json`
4. `references/components/page-composition.md`
5. `references/page-blueprint-design.md`
6. the domain reference selected by the task route, such as
   `references/domains/email-workbench.md`

After automatic blueprint planning (ask only if the user must choose a different
Pattern or primary task):

```bash
node scripts/locate-monorepo.mjs --start "$PWD"
node scripts/resolve-workflow-route.mjs --route new-page --repo <monorepo> --receipt-out <route-read-receipt.json>
node scripts/resolve-context.mjs --task <task> --framework <html|react|vue> --mode fast-preview --auto --blueprint <page-blueprint.json> --out <context-packet.json> --receipt-out <context-material-receipt.json>
node scripts/verify-route-materials.mjs --route new-page --repo <monorepo> --receipt <route-read-receipt.json>
node scripts/verify-context-materials.mjs --repo <monorepo> --context <context-packet.json> --receipt <context-material-receipt.json>
node scripts/query-components.mjs --framework <html|react|vue> --capabilities <capability,...> --semantic-context <semantic-context>
node scripts/generate-layout-contract.mjs --context <context-packet.json> --out <layout-contract.json>
node scripts/validate-pc-framework-layout.mjs --contract <layout-contract.json>
node scripts/scaffold-standalone-project.mjs --project <generated-project> --repo <monorepo>
node scripts/generate-framework-page.mjs --context <context-packet.json> --layout-contract <layout-contract.json> --blueprint <page-blueprint.json> --content-recipes <page-content-recipes.json> --page-css <page-composition.css> --bindings <page-bindings.json> --out <page-module> --entry-out <generated-page-entry> --manifest <framework-page-manifest.json> --component-usage <component-usage.json> --require-blueprint --require-content-recipes --require-slots
node scripts/stamp-framework-artifact.mjs --manifest <framework-page-manifest.json> --artifact <final-index.html> --required-stylesheet <bundled-component-and-token.css> --required-stylesheet <page-composition.css>
```

The route resolver returns `materials` with repository-relative paths, roles, and
SHA-256 hashes. The route read receipt must cover that static closure. Context
resolution then adds the selected Pattern/domain/titlebar/validation materials;
`--receipt-out` records that complete dynamic closure and
`verify-context-materials.mjs` checks it immediately before generation. If a
route source, Pattern, component registry, Token registry, or referenced guide
drifts, refresh the index, route receipt, and Context Packet receipt before
compiling. A missing, stale, or partial receipt is a blocking generation error.
Blueprint and recipe validation run inside generation; separate validator
commands are diagnostic tools, not mandatory duplicate passes. Component
queries are targeted to ambiguous or additional capabilities, not a second
whole-library discovery. Run this sequence for the selected framework only;
cross-framework and Skill sync tests belong to maintenance.

Run scaffold in the actual project root, not a nested temporary `project/`
directory. For HTML use `--entry ./generated-entry.js` (or the actual relative
generated entry). It creates package.json, index.html, main.js and Vite config
when missing. Install in that directory, then run its build command before
stamping. Do not replace local dependencies with absolute host aliases.

The route's capability list is only a starting selection. Extend the Context
Packet with `--capabilities attachment,collapsible,...` when the task needs
additional library controls. A component missing from the packet is not proof
that it is absent from the library. Query it and extend context first.

For custom HTML business content use the executable `pageModules` API in
page-composition.md. Create its source before generation. Keep Pattern shell
ownership in the renderer and all business DOM updates inside the provided
host. Generated entry, main.js and dist files need no manual repair.

The scaffold Vite plugin checks all imported page CSS while serving/building,
including secondary stylesheets. Keep business CSS scoped to declared content
groups and reuse the component stylesheet without overrides. Before the
generator writes any page artifact, its CSS preflight checks the same source
against the canonical Token registry. Use `var(--color-...)`,
`var(--space-...)`, `var(--gap-...)`, `var(--padding-...)`, `var(--size-...)`,
`var(--height-...)`, `var(--radius-...)`, `var(--shadow-...)`, and the
canonical typography variables as appropriate. Do not invent a page palette,
put a raw color or metric into a local custom property, or use a literal
fallback inside `var(...)`; add a documented layout-contract exception only
when the value is a true structural parameter.

HTML Runtime is responsive: do not set a fixed page/canvas `width`, `height`,
or `transform: scale(...)` on `html`, `body`, `main`, `#app`, or the Pattern
root. The 1728×1152 board is an import-only Pixso capture setting, never page
layout CSS.

Resolve components in framework component → canonical contract → Token-based
custom order. HTML, React, and Vue must use the renderer contract returned by
the Context Packet and must retain the same Pattern/structure digests. For HTML,
the strict `component-usage.json` is mandatory. Every visible or interactive
element must be classified as registered, contract-based, or custom; custom UI
must include registry-search and missing-capability evidence and must not
overlap an available HTML component. The generation gate checks this before
writing the page module, so a missing-capability claim cannot be used to draw a
library component by hand.

`page-blueprint.json`, `page-content-recipes.json`, `stylePlan`, and `behaviorPlan` are required inputs before generation. The
blueprint records the user, work object, primary job, design rationale, region
responsibilities, content groups, data entities, states, interactions, success
criteria, and recovery paths. Every
content recipe must cover every Blueprint content group. It selects either
registered composition or a page-owned composite. Page-owned composites must
declare the business fields and states, the missing capability, queried and
rejected candidates, Token roles, and whether they remain page-owned or should
be promoted to the component library. Every page-owned composition group must declare its region, Token roles, and
`componentBoundary: "preserve"` in `stylePlan`; a group class name must be
declared there too. Every planned interaction must declare a supported behavior
kind, trigger binding IDs, and an observable `outcome` in `behaviorPlan`; interactive bindings refer to
the plan with `behaviorId`. The generated entry module is the only supported
application entry for the page. Do not recreate its mount or component tree in
a project `main.js`.

The selected Pattern's geometry is equally fixed. Use the resolver-provided
title segments and scroll bodies; do not reproduce pane padding in a page
group. For Pattern B, compose at the actual 360px secondary width and use the
16px surface / 24px content axes defined by the contract. The business model
still decides what the row or card means, which fields lead, what is selected,
and how the detail relates to it.

Build each `page-bindings.json` entry from the Context Packet and the exact
`query-components.mjs --context` result. For example, use
`primary-navigation-shell` for Primary Navigation Item,
`secondary-navigation` for Sidebar Item, `secondary-list-search` for Search,
`repeated-list-row` for List Item, and `selection-control` for Checkbox.
Use `primary-navigation-titlebar`, `global-titlebar`, or
`main-detail-titlebar` for the corresponding Titlebar placement.
Do not hand-copy a previous page-bindings file: a stale binding can refer to a
component that is not present in the current renderer contract.

Prefer aliases from `designContext.iconAliases`, including nested navigation
items and Titlebar actions. If a request supplies a direct Lucide/source name
or an icon that is not registered yet, convert it to an approved alias before
generation. Unknown icon aliases are a generation error. Use only aliases
from `assets/icons/icon-aliases.json`; do not rely on a direct-source, suffix,
or visual fallback. This preflight is not a replacement for target-framework
runtime evidence. Do not manually rewrite the generated mount entry after a
failure; repair the owning binding.

Do not use prior generated pages as design references. They are not historical
inputs to this route. Only a user-approved page explicitly named with
`--approved-reference <id>` may be read from `references/approved-pages/`; it
can inform page-level composition only and cannot override the canonical
Pattern, component, Token, or behavior contracts.

If the selected Pattern requires two-level navigation, declare
`patternMode.navigation: "two-level"` and build the left pane through
`patternShell.navigation.slots`, not `composition.regions.primary-navigation`.
The Pattern renderer fixes its order: brand/action at the top, secondary
navigation in the middle scroll area, and icon-only primary navigation at the
bottom. Treat this as a shell constraint, not a model-authored layout choice.

The normal generation gate is the following four-part runtime/delivery check:

1. component contract and mapping resolution, including Pattern binding;
2. selected target-framework adapter load/render checks;
3. interaction and basic semantic continuity (roles, names, states, keyboard
   activation, and event paths);
4. exact project artifact and runtime evidence. Cross-framework tests and Skill
   synchronization run during library/Skill maintenance, not each page build.

Visual parity, contrast, and Token-style comparison are optional audit steps in
this project. Do not block ordinary generation on them unless the user asks for
a visual/style or release-readiness audit.

For HTML, React, and Vue, `page-bindings.json` must include one nested
`composition.regions` tree. The model owns page information architecture and
business grouping in that shared tree; registered leaves still render through
the component package. A flat component list is only an inventory and must not
be delivered as a page.

Start managed services and preview the generated component-backed artifact.
Capture runtime evidence from that exact artifact and run
`scripts/verify-fast-preview.mjs` before reporting it ready. A module or
intermediate manifest passing validation does not authorize delivery of a
separately handwritten HTML file. If the user requests one standalone HTML
file, use an approved bundler that consumes the generated component source; if
the workflow has no such bundler, report the packaging gate as blocked.

The artifact stamp is mandatory after every bundling or HTML/CSS edit. It binds
the exact HTML and every linked local stylesheet to the framework manifest. A
missing, empty, unlinked, or subsequently modified stylesheet is a blocking
failure; never reuse an older validation report or runtime evidence file.

If component lookup, Pattern resolution, or page generation fails, stop and
report the failed gate. Do not switch to editing `main.js`, `index.html`, or
page CSS by hand to keep the preview moving. A Vite/npm build proves only that
the application compiles; it does not prove Pattern composition or component
reuse. The final artifact must be traceable to
`generate-framework-page.mjs`, its `framework-page-manifest.json`, and the
HTML `component-usage.json` when the target is HTML.

Show the first interactive preview and pause for approval before optional
release-readiness validation or Pixso refinement.

Fast Preview may contain `provisional` components, but the result is
preview-only and must say so. Before formal delivery, run
`scripts/validate-web-component-reuse.mjs --stage release`; every registered
component must resolve to `approved` under
`references/components/component-readiness-policy.json`.

Do not use this route merely to import an already approved HTML page unchanged.
