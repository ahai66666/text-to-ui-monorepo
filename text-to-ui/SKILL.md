---
name: text-to-ui
description: 'Turn text requests into task-informed HarmonyOS PC desktop tools through HTML-first, Pixso-first, or direct-HTML workflows. Use for page generation, design-system reuse, Pixso/HTML conversion, dashboards, workbenches, settings, editors, and analysis screens.'
---

# Text to UI

Build HarmonyOS PC interfaces by routing each request to one small workflow,
then loading only the references named by that workflow. Production components
and Tokens live in the Monorepo; this Skill orchestrates them.

## 1. Choose exactly one route

Classify before reading detailed references. Run the route resolver when useful:

```bash
pnpm index:check
node scripts/resolve-workflow-route.mjs --route <route-id> --repo <monorepo> --receipt-out <route-read-receipt.json>
```

| Request | Route ID | Read next |
| --- | --- | --- |
| Import an already approved/rendered HTML page into Pixso | `existing-html-to-pixso` | `references/routes/existing-html-to-pixso.md` |
| Create or materially redesign a page/flow | `new-page` | `references/routes/new-page.md` |
| Exact change to an approved artifact | `micro-revision` | `references/routes/micro-revision.md` |
| Build, repair, or synchronize Pixso components | `pixso-component-library` | `references/routes/pixso-component-library.md` |
| Diagnose a failed converter/import run | `converter-diagnosis` | `references/routes/converter-diagnosis.md` |
| Audit, refactor, or repair this Skill and its mappings | `skill-maintenance` | `references/routes/skill-maintenance.md` |

Do not read another route or a broad Pixso reference unless the chosen route
explicitly sends you there. `references/routes/index.json` is the maintained
machine-readable directory and `references/routes/materials.source.json` is
the maintained material closure. The resolver returns every required material
with its repository-relative path, role, and SHA-256. Verify the exact read
receipt before confirmed generation:

```bash
node scripts/verify-route-materials.mjs --route <route-id> --repo <monorepo> --receipt <route-read-receipt.json>
```

Directory drift, missing materials, stale hashes, or a partial read receipt are
blocking routing errors, not reasons to guess a fallback workflow.

### Existing-output shortcut

An explicit request to import a named existing HTML URL as a static Pixso board
is already structurally determined. Restate the URL, viewport/state, fidelity
target, and “no redesign” in one sentence, then execute the
`existing-html-to-pixso` route. Do not run a product interview or load new-page
requirements unless the user asks to change the page structure or behavior.
If prose appears to be appended to a static HTML directory URL, do not browse
or import that malformed path. Let the route's URL resolver validate it against
the supplied HTML root and record any deterministic correction.

## Mandatory Gate 0: analyze and build the page blueprint

For a new page, first run `resolve-context.mjs --discover` as described in
`references/routes/new-page.md`. Understand the selected Pattern geometry,
real component inputs and icon aliases before designing the blueprint.
Read `references/page-design-guidance.md` once. The model designs the business
information architecture; the renderer owns the shell. Do not turn a component
inventory into a page outline. Discovery is deliberately unconfirmed and cannot
compile a page; resolve `--auto --blueprint` after the design decision.

A request to make or generate a page authorizes investigation. For a new page,
redesign, multi-view flow, or materially changed information architecture,
complete the analysis below and write a page blueprint before component binding.

### Gate 0 for new builds and redesigns

For a new page, redesign, multi-view flow, or materially changed information
architecture, inspect first and present a concise proposal containing:

- user, work object, primary job, success and recovery;
- hard constraints and assumptions;
- page/flow tree and canonical HarmonyOS PC Pattern;
- actions, states, target framework, workflow, and Pixso fidelity;
- at most three decisions that would materially change the result.

Write `page-blueprint.json` with the user, work object, primary job, design
rationale, region responsibilities, content groups, data entities, states,
interactions, success criteria, and recovery paths. Then write
`page-content-recipes.json`: every content group must choose either registered
component composition or a page-owned composite with its missing-capability
evidence, fields, states, and Token roles. The two files are automatic inputs
for the first preview; ask only when missing information would change the
Pattern or primary task.
Read `references/page-blueprint-design.md` for the required information
architecture, data relationships, state matrix, and representative row/card
decision. A blueprint that only enumerates components or names three panes is
invalid.
Repository diagnosis is read-only unless the user separately authorizes a fix.

## 2. Universal source and layout rules

### One-shot compliant page generation

Normal new-page work uses `scripts/generate-compliant-page.mjs` as the single
delivery entry point. The model supplies the page decision files
(`page-blueprint.json`, `page-content-recipes.json`, `page-bindings.json`, and
Token-checked page CSS); the command resolves or refreshes the route and
Context Packet, writes and verifies both material read receipts, derives the
Layout Contract, and then calls the strict framework generator. It stages all
generated files beside their final paths and commits them only after the
Pattern, component adapter, slot, Token, icon, behavior, and page-composite
gates pass. A failed gate must leave no new page module, entry, manifest,
component-usage file, or UI Scene.

Use this for a normal new page:

```bash
node scripts/generate-compliant-page.mjs \
  --project <generated-project> \
  --repo <monorepo> \
  --framework <html|react|vue> \
  --task <request> \
  --blueprint <page-blueprint.json> \
  --content-recipes <page-content-recipes.json> \
  --bindings <page-bindings.json> \
  --page-css <page-composition.css>
```

If `--context` and `--layout-contract` are omitted, the command creates them
under `<generated-project>/.text-to-ui/`, verifies the route/context closure,
and records `generation-receipt.json`. Use the lower-level
`generate-framework-page.mjs` only for Skill maintenance and regression
fixtures; it is not the normal page-authoring path. An empty project is
scaffolded automatically; pass `--scaffold` to refresh the managed local
package copies in an existing standalone project.

Treat `assets/design-system/pattern-contracts.json` as the machine-readable
truth layer for application composition. Resolve it before selecting
components or compiling `ui-scene.json`. HTML, React, Vue, and Pixso must
consume the same resolved Pattern Contract; a framework adapter may implement
component internals, but it must not restate pane order, width policy, inset or
scroll ownership, surfaces, dividers, minimum window, or action-slot rules.
For HTML, `@text-to-ui/pattern-runtime` is the only shell renderer: page
modules fill declared content slots and never create panes, titlebars, scroll
bodies, or navigation shells. HTML is responsive and has no design-canvas
width, height, or scale transform; a `1728×1152` size belongs only to the
Pixso import/capture board.
Patterns are compositions, never component registry entries or Pixso base
components.

Resolve every visible region in this order:

1. real target-framework component;
2. matching canonical component contract;
3. Token-based page-owned composition.

Lookalike markup, copied CSS, screenshots, matching class names, and
`data-component` do not prove component reuse. Components fill Pattern slots;
they do not reshape the shell. If the target-framework component exists, using
it is mandatory: visual fidelity, delivery speed, or a standalone-file request
never permits a handwritten replacement. First extend it through supported
Props and Slots, then compose it with other registered components. Use a
Token-based page-owned implementation only after registry discovery proves
that no matching component or contract can satisfy the capability.
Page composites receive `mount(host, { renderComponent })` for business data
and state only. Every control and icon must call the supplied renderer with a
registered component and semantic icon alias. Raw native controls, SVG icons,
global `document.querySelector`, and Pattern data attributes are generation
errors.

Treat a selected Pattern as a renderer-owned design skeleton, not a checklist
to apply afterward. Where a Pattern exposes a navigation mode, the generator
owns its structural slots and their order; the model supplies only the slot
content. In two-level navigation, second-level content belongs to the middle
scroll slot and icon-only first-level navigation belongs to the bottom slot.
A page binding that attempts another placement is a generation error.
The resolved Pattern `geometry` block is also authoritative: it owns title
height, pane inset, content axes, scroll-body ownership, and slot spacing.
Page-owned groups inherit the Pattern inset and may only arrange their own
business content inside it. They must not add a second pane padding wrapper.

Before compilation, require a Style Plan and Behavior Plan alongside the
selected Pattern and component bindings. The Style Plan declares the limited
Token-backed scope of every page-owned group and preserves component internals.
The Behavior Plan declares interaction kinds, trigger bindings, and an
observable outcome for each interaction. Compile
all target frameworks from the same composition tree and generated entry
module; do not recreate the tree or mount path manually in a product entry.

### Non-negotiable component and Token policy

This policy is a generation contract, not a visual cleanup suggestion:

- If the canonical registry has a target-framework implementation, the page
  must render that component through the framework adapter. Do not recreate it
  with a `div`, copied class names, copied CSS, or a page-owned lookalike.
- Page-owned markup is allowed only after the Context Packet and registry
  search document the missing capability. Its `component-usage` entry must
  keep the query, rejected candidates, missing capability, and shared Token
  roles. Any control, field, attachment action, or icon inside it still uses
  the supplied `renderComponent` adapter.
- Page-owned CSS may use canonical `var(--...)` references only for visible
  design values: colors, typography, radii, shadows, spacing, and component
  dimensions. A local custom property is valid only when it aliases a
  canonical Token; it may not contain a new hex/rgb color or a raw px/rem/em/pt
  value.
- The only literal layout values allowed by this rule are explicit entries in
  `layout-contract.json.cssStructuralParameters`, each with a reason. The
  `1728×1152` board size is a Pixso capture contract, not an HTML CSS value.
- `generate-framework-page.mjs` runs the Token and page-owned component
  preflight before writing the page module, entry, manifest, or UI Scene. A
  browser preview check is regression evidence, not the place where these
  violations are repaired.

Generated pages are disposable outputs, not historical design references. Do
not index, inspect, or reuse a generated page for a later design request unless
the user explicitly registers it in `references/approved-pages/`. This keeps
unreviewed output from changing the user's approved design language. Even an
approved page is explicit-only and may inform page-level information
architecture or composition; Pattern, component, Token, and behavior contracts
remain higher authority.

Every generated page must classify all visible and interactive UI in
`component-usage.json` as `registered`, `contractBased`, or `custom`.
`contractBased` and `custom` entries must record registry queries, reviewed
candidates, the exact missing capability, shared Token roles, and whether the
result remains page-owned or should be promoted to the library. A custom entry
that overlaps an available target-framework component is a blocking error.

Resolve registered-component delivery status with
`references/components/component-readiness-policy.json`. `approved`
components may pass Fast Preview and release. `provisional` components have
usable source and contract and may be used in Fast Preview with an explicit
warning, but they cannot pass release validation. `blocked` components cannot
be generated. Do not translate the registry's legacy `partial` label directly
into a failure or silently promote it to release-ready.

User-accepted design risks are not component-selection blockers. If the user
explicitly accepts a known visual, contrast, or interaction tradeoff, keep it
in internal readiness evidence but do not repeat it in ordinary usage guidance
or prevent the Skill from selecting the component for Fast Preview. Continue
to block only unavailable source, invalid contracts, broken mappings, or
runtime failures; surface accepted-risk details only when the user asks for
an audit or release-readiness report.

### Mandatory component-generation gate

For normal page generation, the blocking gate is limited to these checks:

1. Resolve the selected Pattern Contract and preserve its declared regions,
   slots, and digests.
2. Resolve every registered component through the framework adapter, canonical
   component contract, and mapping registry; a page binding must never name a
   component absent from the renderer contract.
3. Confirm that the selected target framework loads and renders its declared
   runtime bindings. Cross-framework parity belongs to component maintenance,
   not every new-page run.
4. Confirm that declared interactions and basic semantics remain connected:
   names, roles, states, keyboard activation, and event paths must not be
   dropped by the adapter or page composition.
5. Reject page-owned CSS literals, unknown Token references, and page-owned
   custom entries that overlap an available target-framework component.
6. Use the installed synchronized Skill. Run mirror/delivery synchronization
   when maintaining the Skill, not while generating an ordinary page.

Icon resolution is a page-generation blocker. Prefer the Context Packet's
canonical aliases for reusable components and exact Pixso provenance. Direct
Lucide/source names and not-yet-registered requests must be converted to an
approved alias before compilation; unknown aliases stop the owning binding.
Pixso preparation uses the same registered alias map and must not introduce an
untracked fallback icon.

The route resolver and Context Packet form one material-closure gate. Resolve
the route with `--receipt-out`, resolve context with a second `--receipt-out`,
then run `verify-route-materials.mjs` and `verify-context-materials.mjs` before
compilation. These receipts list repository-relative paths, roles, and SHA-256
hashes; missing, stale, partial, or unexpectedly added materials stop page
generation instead of letting a multi-directory route silently drift.

For a MAJOR Skill update, follow
`references/governance/major-version-update-checklist.md`. This is the living
maintenance inventory for routes, material closures, Pattern contracts,
component adapters, Tokens, icons, generators, tests, previews, and delivery
mirrors. The update report must explain what changed and what a page author
must migrate; “sync passed” alone is not a sufficient release note.

For any core maintenance change (including a patch), build and validate
`references/index/generated/skill-catalog-index.json` before changing sources.
It is the required discovery index across routes/Context Packets/receipts,
Pattern/Skeleton/Runtime/Secondary Page, component adapters, Tokens/type/icons,
UI Scene/generators, evidence gates, mirrors, and Gallery/Preview/Baseline.
Read the affected canonical entries from the catalog; a mirror or a gallery
example never substitutes for a contract source.

Visual parity and contrast comparison are not default blockers for this
project because the supplied Tokens and component styles are treated as
canonical. Token reference correctness and component reuse are different:
they are generation blockers and are checked before output. Run broader
visual/style comparison only when the user explicitly requests an audit or
formal release-readiness report. Never weaken the runtime and delivery checks
above to make generation continue; stop at the exact failed mapping or Token
gate and report it.

For a new page, choose and validate one canonical PC Pattern before component
selection. Preserve the Global Title Layer, pane order, inset owner, scroll
owner, resize behavior, minimum window, and action slots. Use the exact layout
and component references returned by the Context Packet; never load the whole
registry merely for convenience.

Bind `page-spec.json.shell.patternContract` and
`ui-scene.json.page.patternContract` to
`assets/design-system/pattern-contracts.json` schema version 1. Use
`scripts/resolve-pattern-contract.mjs`; do not implement Pattern decisions
independently inside HTML, React, Vue, or Pixso renderers.

Compile new HTML, React, and Vue pages through
`scripts/generate-framework-page.mjs`. The Context Packet must expose a
non-null renderer contract for the selected framework. Every framework output
and Pixso Operation Plan must carry the same `patternDigest` and
`structureDigest`; a digest mismatch, invented region, or undeclared Pattern
slot is a blocking error. `ui-scene.json` is the shared page intermediate, not
a Pixso-only document.

When the project is outside the Monorepo, invoke scripts from the installed
Skill root or the repository's `text-to-ui/scripts` directory and pass the
Monorepo explicitly with `--repo` when needed. Never assume the user's project
has a top-level `scripts/` directory. Component queries use comma-separated
capability IDs and a semantic context value; `--context` is not a Context Packet
file path.

For HTML, `generate-framework-page.mjs` must also emit the strict
`component-usage.json`. Validate the exact browser artifact delivered to the
user with `scripts/verify-fast-preview.mjs` and runtime evidence captured from
that artifact. Passing an intermediate component module does not validate a
later handwritten HTML replacement. A standalone HTML file is allowed only
when it is built from the component-backed source by an approved bundling step;
if no such step is available, stop at that gate instead of recreating the
components by hand.

If component lookup, Pattern resolution, or page generation fails, stop at the
failed gate. Do not continue by editing `main.js`, `index.html`, or page CSS by
hand. A Vite/npm build proves compilation only; it does not prove Pattern
composition or component reuse. The delivered artifact must be traceable to
`generate-framework-page.mjs`, its framework-page manifest, and the HTML
`component-usage.json` when the target is HTML.

After bundling, stamp the final HTML and all linked local stylesheets with
`scripts/stamp-framework-artifact.mjs`. Any later HTML or CSS edit invalidates
the stamp and requires recapture of runtime evidence. New HTML pages must use
strict schema version 2; legacy component declarations cannot pass a new-page
delivery gate.

`primary-navigation-item` is the icon-first primary rail item; `sidebar` is the
labeled secondary navigation row. They are not aliases.
For business pages, Sidebar bindings must declare `options.items` or
`options.groups`; the adapter's illustrative gallery defaults are not a valid
source of page data and are rejected by the page compiler.

For a new page, create and validate `page-blueprint.json` and
`page-content-recipes.json` before `page-bindings.json`, then pass both to
`generate-framework-page.mjs`. The blueprint is the design decision layer;
content recipes decide registered component versus page-owned composite; and
bindings are only the implementation layer. Use `scripts/scaffold-standalone-project.mjs`
for projects outside the Monorepo so package dependencies are copied into
`vendor/` and rewritten from `workspace:*` to local package references. The
scaffold also writes a local `pnpm-workspace.yaml` boundary when the page is
nested inside another workspace; install and build from that project root so
an ancestor lockfile cannot silently select a stale Runtime package.

`page-bindings.json` is not the canonical page structure. The compiler must
produce a shared `ui-scene.json`/composition plan with separate
`patternSlot` and `componentSlot` namespaces. Pattern B Titlebar segments,
including `main-detail-actions`, are nested component slots and must not be
reconstructed by scanning or moving sibling nodes after the page is built.

Page-owned CSS must not select or redefine Pattern-owned selectors such as
`data-pattern`, `data-pattern-region`, `data-pattern-shell-slot`, or
`data-tui-pane-role`. Use the Pattern shell supplied by the renderer and style
only declared page composition groups.

### Stroke and divider ownership (non-negotiable)

Pattern boundaries are separators, not card outlines. The Runtime/Pattern Shell
is the only owner of the structural strokes declared by a Pattern contract's
`dividerEdges`: it renders a single Token-backed line using
`--layout-navigation-divider-width` (currently `0.5px`) and
`--color-border`. The global title row, pane grid, pane containers, and
Titlebar components must not receive an extra page-owned `border`, `outline`,
or `box-shadow` around their full rectangle. A page stylesheet that paints a
second pane edge, wraps a Pattern pane in a bordered card, or uses `1px`/`2px`
as a substitute divider is a generation error.

Registered components retain their own visual contract: a field, menu, card,
table, or selected-state indicator may draw the border specified by that
component. Page CSS must not override those internals. `outline` is reserved
for an interaction's `:focus-visible` state and must use the component's
focus-ring Token; it is never a persistent layout separator or a screenshot
annotation. The page generator and CSS-boundary checks enforce this ownership
before an artifact is written.

Universal Titlebar baseline (non-negotiable): every generated canonical
Pattern page has one renderer-owned Titlebar scene. Bind exactly one registered
`Titlebar/Default` to `global-title-layer` before generating page content. The
page may select only a registered Titlebar size: `M`/`medium`, `L`/`large`, or
`XL`/`xlarge`; `L` is the default. `S`/`small` is reserved for standalone
Secondary Page titlebars and is rejected in a Pattern title layer. The compiler
records the resolved size and binding in `titlebar-scene.json`; a page header,
handwritten toolbar, or missing global Titlebar is therefore a pre-generation
error. Pattern contracts still own segment order, pane boundaries, height,
insets, and window-control ownership; size is the only page-level variation.

Pattern B title-layer gate (non-negotiable): a two-level navigation page must
bind exactly one direct `Titlebar/Default` to `global-title-layer` for the
primary-navigation segment (`layout: "three-column"`, `paneRole:
"primary-navigation"`, no window controls). Never wrap that Titlebar in a page
header or place a collapse/brand/button sibling in the slot. The secondary-list
title segment accepts at most one registered Search binding and requires the
explicit `secondary-list-title` slot; Runtime owns its 64px cross-axis centering,
full width, and `space/5` inline inset. The right segment requires exactly one
`Titlebar/Default` in `main-detail-title` (`layout: "three-column"`,
`segmentRole: "main-detail"`). Business actions belong to that Titlebar's
`slots["main-detail-actions"]`, optionally mapped with `actionBehaviors`; direct
Pattern-level action Button bindings are forbidden. Titlebar owns responsive
overflow plus the registered 3×40px Ghost Icon Button window controls. Scope,
filter, refresh, and selection actions are body content or component-owned
slots. The Runtime shell provides the subtle navigation surface while Titlebar
uses the transparent `--color-titlebar-normal-bg` Token. The strict page
generator rejects any violation before writing an artifact, so a page cannot
drift into a second coloured bar, missing window controls, top-aligned Search,
or an apparent fourth column.

For every canonical Pattern page, the compiler resolves and writes a
`titlebar-scene.json` from `assets/design-system/titlebar-scene-contracts.json`.
This is the page's authoritative Titlebar design record. Pattern B additionally
records its centered Search segment, final Titlebar action order/overflow, and
component-owned window controls. Do not author a second Titlebar layout plan,
copy a gallery specimen, or repair a generated Titlebar in page CSS. Change
only product copy, declared Titlebar actions, or the approved size; a scene
mismatch blocks generation before the page artifact is written.

### Pattern Runtime entry point

For a browser preview or a generated HTML page, call
`@text-to-ui/pattern-runtime` instead of rebuilding a Pattern shell in page
markup. Resolve the same registry entry first, then use
`createPatternRuntime({ registry, patternId, mode, slots })`. `mode: "skeleton"`
renders slot placeholders for design review; `mode: "runtime"` requires every
required slot and renders page-owned content inside contract-owned regions. Use
the optional `regionContent` map for page-owned body content that is not a
registered component slot (for example a list pane's rows); it is ignored in
Skeleton mode. The runtime owns pane order, minimum window, region metadata, title layer,
scroll-body boundaries, and navigation slot placement. Page code owns only the
slot values. Use `runtime.decorate(root)` when an approved legacy preview must
keep its existing visual markup while adopting the same contract metadata.
Import `@text-to-ui/pattern-runtime/styles.css` for the structural shell
styles.

Generated HTML entries also mount `bindTitlebarOverflow` from
`@text-to-ui/components-html`. This is required for Pattern B detail actions:
the adapter measures the final segment, keeps the More trigger and window
controls in place, and moves only non-fitting business actions into the More
menu. A page must not reimplement this with a second toolbar or fixed-width
CSS.

For the approved Secondary Page compositions, use
`createSecondaryPageRuntime({ layout: "continuation" | "new-page", mode, slots })`.
`continuation` renders the inline back-navigation + pane-aligned `Titlebar_L`
two-column arrangement; `new-page` renders standalone `Titlebar_S` above a
vertically organized content surface. `Titlebar_S` is a standalone
single-column titlebar; it is not valid as a two-column or three-column pane
segment. Use a larger Titlebar size for pane-aligned Pattern title segments.
It is a page pattern rather than one of the four canonical A–D Pattern
Contracts, but it follows the same rule: the renderer owns the shell and the
caller owns `navigation`, `titlebar`, and `content`.

Minimal HTML usage:

```js
import patternRegistry from "./assets/design-system/pattern-contracts.json";
import { renderHtmlComponent } from "@text-to-ui/components-html";
import { createPatternRuntime } from "@text-to-ui/pattern-runtime";
import "@text-to-ui/pattern-runtime/styles.css";

const runtime = createPatternRuntime({
  registry: patternRegistry,
  patternId: "pattern-b-three-pane",
  mode: "runtime",
  slots: {
    "global-title-layer": renderHtmlComponent("titlebar", { label: "任务", layout: "three-column", paneRole: "primary-navigation", showWindowControls: false }),
    "primary-navigation-shell": "<nav>…</nav>",
    "secondary-navigation-content": "<nav>…</nav>",
    "main-detail-actions": "<button type=\"button\">更多</button>"
  }
});
document.querySelector("#app").innerHTML = runtime.render();
```

This is the callable boundary for Skills: the Skill selects a Pattern and
provides slot content; it must not copy the Pattern preview or invent pane
geometry. Framework-specific adapters may wrap the same runtime contract, but
they must not restate its layout decisions.

### Mapping and Pixso details

For component/Token mapping or Pixso import, read
`references/pixso-import-details.md`. It owns typography, icon sizing, mapping
registry policy, and component-facts synchronization. HTML-only edits do not
need these Pixso-specific rules.

## 3. Services and preview

Use the managed service entry only:

```bash
node scripts/start-text-to-ui-services.mjs start
```

It idempotently starts the Preview Hub, Component Gallery, and Pixso Bridge.
The public Hub is `http://127.0.0.1:43173/`; the internal bridge is `43982`.
Do not start an ad-hoc `4173` service for new work. A user-provided existing
`4173` URL may still be captured as the source page.

For new HTML/React/Vue output, show an early interactive browser preview after
layout and component-source checks. Release validation occurs only after the
user approves the direction.

## 4. Pixso execution

For Pixso execution, read `references/pixso-execution-invariants.md`.
Normal imports use the current browser capture, one compiler, one executor,
and verified readback. The diagnostic semantic adapter is separate.

The normative source is this `text-to-ui/` directory. Synchronize the repository
`skill/` mirror, installed Skill, and installable Pixso plugin only after source
tests pass.

## 5. Completion

Report completion only when the chosen route's acceptance gates pass. Preserve
unrelated user changes. Stop and report the exact failed gate rather than
silently switching routes, replaying old artifacts, or drawing manual overlays.
Return final artifact paths, validation status, and honest limitations.
