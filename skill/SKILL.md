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
| Audit, refactor, or repair this Skill and its mappings | `skill-maintenance` | `references/routes/skill-maintenance.md` |

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
layout, component-source, and Token checks. Release validation occurs only after
the user approves the direction.

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
