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
node scripts/resolve-workflow-route.mjs --route <route-id>
```

| Request | Route ID | Read next |
| --- | --- | --- |
| Import an already approved/rendered HTML page into Pixso | `existing-html-to-pixso` | `references/routes/existing-html-to-pixso.md` |
| Create or materially redesign a page/flow | `new-page` | `references/routes/new-page.md` |
| Exact change to an approved artifact | `micro-revision` | `references/routes/micro-revision.md` |
| Build, repair, or synchronize Pixso components | `pixso-component-library` | `references/routes/pixso-component-library.md` |
| Diagnose a failed converter/import run | `converter-diagnosis` | `references/routes/converter-diagnosis.md` |

Do not read another route or a broad Pixso reference unless the chosen route
explicitly sends you there. `references/routes/index.json` is the maintained
machine-readable directory.

### Existing-output shortcut

An explicit request to import a named existing HTML URL as a static Pixso board
is already structurally determined. Restate the URL, viewport/state, fidelity
target, and “no redesign” in one sentence, then execute the
`existing-html-to-pixso` route. Do not run a product interview or load new-page
requirements unless the user asks to change the page structure or behavior.
If prose appears to be appended to a static HTML directory URL, do not browse
or import that malformed path. Let the route's URL resolver validate it against
the supplied HTML root and record any deterministic correction.

## Mandatory Gate 0: analyze, propose, confirm

A request to make or generate a page authorizes investigation; it does not
approve an inferred page structure. For a new page, redesign, multi-view flow,
or materially changed information architecture, complete the analysis below
before any renderer or page artifact.

### Gate 0 for new builds and redesigns

For a new page, redesign, multi-view flow, or materially changed information
architecture, inspect first and present a concise proposal containing:

- user, work object, primary job, success and recovery;
- hard constraints and assumptions;
- page/flow tree and canonical HarmonyOS PC Pattern;
- actions, states, target framework, workflow, and Pixso fidelity;
- at most three decisions that would materially change the result.

Mark `Confirmation: pending`. Ask the user to confirm the proposal and build
only after explicit confirmation. Do not silently infer confirmation from the
original request or from an ambiguous acknowledgement.

Before confirmation, do **not** create or modify page HTML, React, Vue, CSS,
Pixso Frames, images, `page-spec.json`, `layout-contract.json`,
`component-usage.json`, or a browser preview. Read-only inspection and a
temporary context packet are allowed.
Repository diagnosis is read-only unless the user separately authorizes a fix.

## 2. Universal source and layout rules

Treat `assets/design-system/pattern-contracts.json` as the machine-readable
truth layer for application composition. Resolve it before selecting
components or compiling `ui-scene.json`. HTML, React, Vue, and Pixso must
consume the same resolved Pattern Contract; a framework adapter may implement
component internals, but it must not restate pane order, width policy, inset or
scroll ownership, surfaces, dividers, minimum window, or action-slot rules.
Patterns are compositions, never component registry entries or Pixso base
components.

Resolve every visible region in this order:

1. real target-framework component;
2. matching canonical component contract;
3. Token-based page-owned composition.

Lookalike markup, copied CSS, screenshots, matching class names, and
`data-component` do not prove component reuse. Components fill Pattern slots;
they do not reshape the shell. Record source evidence in `component-usage.json`
when a generated page requires it.

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

`primary-navigation-item` is the icon-first primary rail item; `sidebar` is the
labeled secondary navigation row. They are not aliases.

### HTML text sizing and truncation

For HTML-to-Pixso conversion, use the browser's final computed style and text
metrics as the authority. Do not infer fixed sizing merely because an element
has a CSS width or defensive overflow rules:

- A normal single-line label defaults to `WIDTH_AND_HEIGHT` so its width hugs
  its content.
- A wrapping text block keeps the captured width and uses `HEIGHT` so its
  height can grow.
- Use fixed-width, single-line truncation only when the HTML has
  `white-space: nowrap`, `overflow: hidden` or `clip`, and
  `text-overflow: ellipsis`, and the measured inline text width is greater
  than the captured box width. Preserve the captured width and height and set
  `maxLines: 1`.
- For a truncation operation, first write Pixso's native
  `TextNode.textAutoResize = "TRUNCATE"` after loading the font. If the
  connected runtime rejects that enum, use the versioned compatibility
  renderer: measure the loaded text, write an actual ending `…` that fits the
  fixed captured box, retain `NONE`, and store the source/rendered strings in
  plugin metadata. Readback must accept this only when all of those markers,
  the ellipsis, and fixed bounds are present; never silently clip the full
  string or invent a separate `textTruncation` property. If the text fits,
  keep the intrinsic mode even when the CSS contains defensive ellipsis rules.

The detailed import contract is in
`references/pixso-fidelity-import-pipeline.md`; read it for existing HTML
imports and converter diagnosis.

### Icon sizing, stroke, and hot-zone contract

For every semantic SVG icon, keep the 24 × 24 source geometry and treat the
Pixso icon slot as a separate square hot zone:

- Use the design-system stroke table as the authority: 16px → 1px, 20px →
  1.25px, and 24px → 1.5px. For another explicitly approved size, use the
  normalized 24px source rule `1.5 × displaySize ÷ 24`; never copy an asset's
  raw stroke-width unchanged into every display size.
- Set both horizontal and vertical hot-zone alignment to `CENTER`. Centre the
  actual vector bounds inside the slot after hydration; do not use the
  requested icon size as a proxy for the vector bounds and do not inherit top
  alignment from a component or HTML wrapper.
- Use the Pixso `Size & Layout` number variables `icon/stroke/16`,
  `icon/stroke/20`, and `icon/stroke/24` for the three supported weights. The
  Operation Plan must carry these variable references; a literal weight is
  only a diagnostic fallback when the target Pixso file has not synced the
  variables yet.
- Apply the same contract to page SVGs, generated icon Components, and icon
  Instances. A missing exact icon can remain as the original SVG, but an
  approximate glyph or a top-aligned placeholder is not an acceptable
  fallback.
- The operation plan must carry `hotZone: { alignment: "CENTER", axes:
  "BOTH" }`; Pixso readback must verify both alignment properties, vector x/y
  centring, and the effective stroke weight.

### Cross-source mapping registry

Before mapping any HTML Token, Component, Pixso Variable, Pixso Component, or
HarmonyOS native source, read and use
`assets/design-system/mapping-registry.json`. It is the machine-readable
relationship source for the Skill. A user may propose changes in the controlled
Obsidian mapping-workbook edit queue, but never treat a generated report table
as an editable source:

- `tokenMappings`, `semanticTokenMappings`, `runtimeSemanticAliases`,
  `semanticColorMappings`, and `styleMappings` own Token/Style relationships.
- The runtime semantic index is generated from `semanticTokenMappings` plus
  `runtimeSemanticAliases`; do not maintain a duplicated full
  `runtimeSemanticMappings` table.
- `componentMappings` owns HTML `logicalName` → current Pixso exact
  Component Set/COMPONENT relationships and runtime bindings. Validate
  `pixsoTarget` against `assets/design-system/pixso-component-facts.json`;
  keep `pixsoSpecKey` as the separate Text-to-UI specification key and keep
  Variant selection in `runtimeBinding.variant`.
- `nativeSourceMappings` and `sourceOnly` own HarmonyOS source reuse and
  candidate/reference relationships.
- `profiles` isolate different HTML sources, Pixso design files, and component
  libraries. Add a profile for a new target; do not overwrite an existing one.

### Typography mapping policy

Typography has two related but distinct layers:

- `tokenMappings` records the atomic foundation relationships, such as
  `--font-size-16` → `font/size/16`, `--line-height-22` →
  `font/line-height/22`, and `--font-weight-400` → `font/weight/400`.
- `styleMappings` and `assets/design-system/typography-style-map.json` record
  the composite HTML typography role → exact Pixso Text Style relationship,
  such as `body-l` → `Typography/Body_L` (16px / 20px / 400). The current
  formal set is `display-l/m/s`, `title-l/m/s`, `subtitle-l/m/s`,
  `body-l/m/s`, and `caption-m`; `caption-l` is deprecated.

For standard typography roles, the HTML → Pixso scene must carry
`style.textStyle.ref`, for example `$style/Typography/Body_L`. The Pixso
runtime resolves the existing local Text Style and assigns its `textStyleId` to
the text node. Do not replace an available Text Style with separate
`fontSize`, `lineHeight`, and `fontWeight` assignments. Computed HTML typography
is still captured for geometry and diagnosis; only a non-standard value with
no matching formal Text Style may use the property-level fallback, binding
`fontSize`, `lineHeight`, or `letterSpacing` variables when possible.

A direct Text Style mapping is valid only when the exact Text Style exists in
the current Pixso file and live readback confirms the binding. The variable
names listed in the registry describe the foundation values; they do not by
themselves prove that the Pixso Text Style internally references those
variables. If the style is renamed or a role is remapped, update the style
mapping; changing only an atomic variable mapping does not necessarily update
an existing Pixso Text Style.

The generated runtime maps and coverage tables are projections. If the user
edited the Obsidian workbook, first run
`scripts/sync-obsidian-mapping-edits.mjs --check`; after reviewing the proposed
changes, use its `--write` form to update the registry. Then run
`node scripts/validate-mapping-registry.mjs`,
`node scripts/sync-mapping-registry.mjs --write`, and its `--check` form. Use
`scripts/build-obsidian-mapping-workbook.mjs` for the clear Obsidian maintenance
view and `scripts/build-mapping-registry-doc.mjs` for the detailed report.
Only apply pending rows from the workbook. If a Pixso target is a same-family
candidate rather than an exact registered name, stop and ask for clarification.
Never persist Pixso GUIDs, node IDs, or file keys in the registry; resolve them
from the current Pixso document at runtime.

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
layout, component-source, and Token checks. Release validation occurs only after
the user approves the direction.

## 4. Pixso invariants

- Current rendered HTML is the visual authority for an existing website.
- A normal run uses one fresh run ID, one browser capture, one compile, one
  executor, one readback, and one screenshot diff.
- The browser manifest is the sole geometry source. Component and Token mapping
  happens only after geometry is locked.
- A `TRUNCATE` text operation must carry an explicit semantic
  `textAutoResize: "TRUNCATE"`, fixed captured width/height, and `maxLines: 1`.
  The executor must load the font before trying the native value; a runtime
  that rejects it may use only the versioned ending-ellipsis compatibility
  renderer, whose metadata, visible `…`, and fixed bounds must pass readback.
- Old runs, Baseline Frames, root plans, cached GUIDs, prior screenshots, and
  page-specific Scene defaults never enter a new normal run.
- A normal whole-page HTML import requires the connected Text-to-UI Pixso
  plugin. Never auto-fallback to MCP. MCP whole-page execution is allowed only
  for an explicit diagnostic or after the user explicitly approves the lower-
  fidelity emergency path; never execute both for one run.
- Permanent Agent Kernel `5.0.0`, Bridge protocol `4`, and Operation Plan `5`
  are the current contract. Plans may be queued while Pixso is temporarily
  disconnected; reconnecting the same installed Agent resumes the current job.
- Keep the plugin draft visible while importing. After final readback succeeds,
  atomically replace the previous canonical artboard; on pause or failure,
  remove the draft and retain the previous accepted artboard. A normal run
  must leave exactly one managed artboard.
- Never claim Variable, Style, Component Instance, or visual parity without
  readback evidence.
- Normal HTML import does not call `code_to_design`; that capability is
  diagnostic-only.

The normative source is this `text-to-ui/` directory. Synchronize the repository
`skill/` mirror, installed Skill, and installable Pixso plugin only after source
tests pass.

## 5. Completion

Report completion only when the chosen route's acceptance gates pass. Preserve
unrelated user changes. Stop and report the exact failed gate rather than
silently switching routes, replaying old artifacts, or drawing manual overlays.
Return final artifact paths, validation status, and honest limitations.
