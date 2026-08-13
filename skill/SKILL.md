---
name: text-to-ui
description: 'Turn text requests into task-informed HarmonyOS PC desktop tools through HTML-first, Pixso-first, or direct-HTML workflows. Use for text to ui, design-system reuse, page generation, Pixso/HTML conversion, dashboards, workbenches, settings, content tools, editors, and analysis screens. Always choose a canonical PC framework layout first, then resolve every UI region in this strict order: real target-framework component, matching canonical contract, and only then Token-based custom work. Produce an early interactive browser preview before release validation.'
---

# Text to UI

Build HarmonyOS PC tools by connecting requirements, framework Patterns, Tokens, semantic icons, native HTML/React/Vue components, Pixso mapping, and browser validation. Treat the Skill as the orchestrator; the production components remain in the Monorepo packages.

## Non-negotiable source order

For every visible UI region:

1. Import the real target-framework component when it exists.
2. Otherwise implement the matching canonical component contract.
3. Only when both searches miss, create page-owned UI with shared Tokens, semantic icons, and HarmonyOS PC rules.

Record the source level and evidence in `component-usage.json`. Lookalike markup, copied DOM/CSS, screenshots, matching class names, and `data-component` do not count as reuse. Components fill framework slots; they never invent or reshape the shell.

## Fast entry: locate, route, query

Do this before broad reference reading or page code:

1. Locate the Monorepo:

   ```bash
   node text-to-ui/scripts/locate-monorepo.mjs --start "$PWD"
   ```

   The root must contain `pnpm-workspace.yaml`, the component registry, and the Token runtime map. Respect `--repo` or `TEXT_TO_UI_MONOREPO`. If no root is found, report the attempted locations and request the root; do not silently draw lookalikes.

2. Resolve the minimum task context:

   ```bash
   node text-to-ui/scripts/resolve-context.mjs \
     --task mail-workbench --framework react --mode fast-preview \
     --out /absolute/path/context-packet.json
   ```

3. Read only the packet's `exactReferencesToRead`. Then read the exact selected component entries in `packages/component-contracts/src/components.json`; do not load the complete registry unless the generated index is missing or stale.
4. Query further only when needed:

   ```bash
   node text-to-ui/scripts/query-layouts.mjs --workflow repeated-list-to-detail
   node text-to-ui/scripts/query-components.mjs --framework react --capabilities search,checkbox,list-item
   node text-to-ui/scripts/query-tokens.mjs --roles content/primary,surface/default
   ```

5. If indexes drift, run `pnpm index:build`; never hand-edit files under `references/index/generated/`.

## Core execution flow

### 1. Inspect and propose

Inspect user materials, the current project stack, and reusable assets. Select one workflow:

- `html-first` by default: early HTML preview, user review, optional Pixso refinement, release validation.
- `visual-first` when the user explicitly wants Pixso first.
- `direct-html` when the user explicitly skips Pixso.

Present one concise requirement proposal before creating page artifacts. Include the design goal, a compact page tree, chosen Pattern, key interactions/states, framework and workflow, Pixso fidelity when relevant, and only material assumptions. Use `references/requirement-spec.md`. Wait for explicit confirmation.

### 2. Lock the PC framework layout

After confirmation and before component selection:

1. Read the Context Packet's exact layout sections plus `references/layouts/framework-layout-routing.md`.
2. Choose the simplest approved Pattern A, B, C, or D. Do not start from cards or individual controls.
3. Create `layout-contract.json` with pane order, Global Title Layer, action slots, inset owners, scroll owners, resize behavior, minimum window, and shared layout Tokens.
4. For Pattern B, declare `main-detail-actions` as the `0..n` Titlebar slot for every action scoped to the complete third pane.
5. Run:

   ```bash
   node text-to-ui/scripts/validate-pc-framework-layout.mjs --contract /absolute/path/layout-contract.json
   ```

6. If no approved Pattern fits, propose a reusable Pattern contract instead of improvising a shell.

### 3. Resolve and record components

Read `references/components/source-resolution.md` and `references/web-component-reuse-gate.md`.

1. Select one target framework and resolve required capabilities from the generated component index.
2. Confirm the real source path and exact registry contract for each selected component.
3. Create `component-usage.json` before page implementation.
4. Import `@text-to-ui/components-html`, `@text-to-ui/components-react`, or `@text-to-ui/components-vue`, plus canonical Tokens and shared styles.
5. Keep Patterns, domain compositions, and business content page-owned, but never reproduce registered component internals.
6. Validate reuse before a browser checkpoint:

   ```bash
   node text-to-ui/scripts/validate-web-component-reuse.mjs \
     --manifest /absolute/path/component-usage.json \
     --project-root /absolute/path/project
   ```

### 4. Produce Fast Preview

Read `references/workflows/fast-preview.md`.

1. Build the real interactive page from the validated layout and component sources.
2. Run only blocking preview checks: layout, component source record, successful build/open, target desktop viewport, primary path, critical overlay, and keyboard recovery.
3. Use `verify-fast-preview.mjs` for deterministic checks.
4. Open the real page, show it to the user, and pause for browser comments.
5. Iterate on the same preview until the user explicitly marks the direction approved.

Do not delay the first visible page with exhaustive release, mirror, packaging, or Pixso parity checks.

### 5. Refine in Pixso when selected

For tasks producing Pixso, read these only after the direction and fidelity target are known:

- `references/pixso-fidelity-routing.md` for `fast visual import` versus `strict structured reuse`.
- `references/pixso-visual-parity.md` for CSS viewport calibration and same-state comparison.
- `references/pixso-mcp.md` for live tool behavior.
- `references/registered-reuse-mode.md` only for strict linked-instance reuse.
- `references/dual-output-contract.md` for shared `page-spec.json` and provenance.

Use `1728 × 1152` as CSS pixels and verify browser `innerWidth`/`innerHeight`. Treat HTML and Pixso as renderers of one rule system. Never claim native Pixso Component or Variable parity without read-back proof. Dynamic regions must be materialized in the exact import snapshot before `code_to_design`.

### 6. Run Release Validation

Enter only after explicit direction approval. Read `references/workflows/release-validation.md` and the Context Packet's release commands.

Complete required states, accessibility, resize/minimum-window behavior, error recovery, semantic icons, Token coverage, visual parity, contract stamping, and packaging. Run full repository/delivery checks as applicable. Reopen the exact final artifact at the target viewport and show the validated result again.

## Page contracts and design authority

- Use `assets/design-system/design.md` and machine-readable assets under `assets/design-system/` as the bundled baseline.
- A user-supplied approved design system may override the baseline according to `references/design-system.md`.
- For reusable or dual-output pages, create `page-spec.json` from `assets/design-system/page-spec.schema.json`; validate and stamp it using the scripts named in `references/dual-output-contract.md`.
- Keep requirements, `layout-contract.json`, `component-usage.json`, `page-spec.json`, and produced artifacts synchronized. A changed source contract invalidates stale evidence.

## Conditional reference router

Read only what the current Context Packet or workflow requires:

- Requirements and task modeling: `references/requirement-spec.md`, `references/task-modeling.md`, `references/information-hierarchy.md`.
- Framework layout: `references/layouts/framework-layout-routing.md`, `references/pc-framework-layout-gate.md`, `references/harmonyos-layout-patterns.md`, `references/layout-system.md`.
- Components: `references/components/source-resolution.md`, `references/component-package-integration.md`, `references/web-component-reuse-gate.md`.
- Interaction and HTML: `references/interaction-spec.md`, `references/html-guidelines.md`, `references/qa-checklist.md`.
- Icons and Tokens: `references/icon-usage.md`, `references/tokens.md`, `references/token-component-usage.md`.
- Tool-heavy workflow: `references/tool-design.md`; do not load it for a simple content page.
- Pixso: load only the files listed in step 5 for the selected fidelity path.
- Review modes: `references/workflows/fast-preview.md` and, after approval, `references/workflows/release-validation.md`.

## Tool routing and safety

- Use browser automation for rendering and interaction QA, not as the component source.
- Use Pixso tools only when Pixso output is selected and after reading the relevant live-tool reference.
- Use semantic SVG assets from the shared icon package; do not use text glyphs or emoji as product icons.
- Keep existing user changes intact. Do not overwrite unrelated files or publish without authorization.
- Use reversible, scoped actions. Ask only when a missing decision would materially change structure or external state.

## Completion gate

Do not report completion until:

- The confirmed workflow and requirement contract match the delivered result.
- The PC framework layout contract is valid and visible in every renderer.
- Every UI region follows library → contract → Token-based custom source order, with evidence.
- The page uses real target-framework component imports where available.
- Fast Preview was shown and explicitly approved before Release Validation.
- Required interactions, states, accessibility, viewport, resize, and recovery checks pass.
- Pixso claims, when applicable, are backed by exact snapshot and read-back evidence.
- The exact final artifact was reopened for the final visible review.
- Final paths, validation status, and honest limitations are reported.
