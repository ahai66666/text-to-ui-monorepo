---
name: text-to-ui
description: 'Turn text requests into task-informed HarmonyOS PC desktop tools through HTML-first, Pixso-first, or direct-HTML workflows. Before writing any HTML, React, or Vue page code, locate the Text-to-UI Monorepo, inspect the canonical component registry, and import the real target-framework component package plus shared Tokens and styles. Component reuse is mandatory in every workflow and Pixso mode; data attributes, copied DOM/CSS, old generated pages, and visual lookalikes do not count. Create page-owned components only after documented registry discovery proves the capability is missing. Use for text to ui, design-system and component-registry reuse, page generation, Pixso/HTML conversion, dashboards, admin or operations workbenches, settings, file/content tools, editors, and monitoring or analysis screens.'
---

# text to ui

## Skill Objective

Convert a product requirement, together with any supplied design-system and project materials, through one of three workflows:

1. **HTML-first refinement (preferred):** text → requirement analysis and proposed solution → user confirmation → browser-checked HTML draft → Pixso import and visual refinement → user approval → final interactive demo regenerated from the latest approved design → verification.
2. **Visual-first:** text → requirement analysis and proposed solution → user confirmation → editable Pixso high-fidelity visual → user review and revisions → interactive HTML based on the latest visual.
3. **Direct HTML:** text → requirement analysis and proposed solution → user confirmation → interactive HTML without a Pixso approval stage.

The skill is responsible for adaptive tool discovery, task and work-object modeling, design-system reuse, page composition, interaction definition, implementation, tool-design reasoning QA, visual QA, and final file delivery.

## Overview

Use this skill to turn a brief UI idea into a polished HarmonyOS PC desktop application prototype. Select and follow exactly one workflow at intake. Default to HTML-first refinement when the user does not explicitly select another workflow; do not require Pixso for direct-HTML runs. Always pause once after requirement analysis to show the proposed design target and obtain user confirmation before generating HTML, Pixso, or other page artifacts.

In HTML-first refinement and visual-first modes, Pixso and HTML are two renderers of one rule system. They must share source-of-truth tokens, component variants, interaction states, layout rules, and content hierarchy. The initial HTML in HTML-first mode is a disposable structural draft, not the final source of visual truth; after Pixso approval, the latest Pixso state and synchronized `page-spec.json` govern the final demo. In direct-HTML mode, the requirement contract, design system, and browser-verified implementation are the source of truth. In every mode, treat HTML as a desktop application prototype, not as a generic responsive website.

Read `references/pixso-visual-parity.md` and `references/pixso-fidelity-routing.md` for every task that produces both HTML and Pixso. The first reference is the required contract for same-state screenshots, CSS-versus-physical viewport calibration, fixed desktop geometry, static import snapshots, and content-only comparison. The second selects exactly one Pixso path and defines the ZIP package gate, native component/Variable requirements, and the all-colors-use-Variables rule. `1728 × 1152` always means CSS pixels; verify `innerWidth`/`innerHeight` after applying the browser tool's physical viewport.
For every page-generation task, read `references/web-component-reuse-gate.md` and `references/component-package-integration.md`, locate the Monorepo root, and load `packages/component-contracts/src/components.json` before writing page code. The Skill is an orchestrator and registry reader, not a replacement for the production React/Vue/HTML component source. Resolve component packages relative to the detected repository root (the root containing `pnpm-workspace.yaml`); do not assume the installed `$CODEX_HOME/skills/text-to-ui` directory contains them. If the Skill-only installation cannot discover that root or a required framework package, stop Web generation and report the missing path instead of silently substituting a screenshot, legacy preview, copied DOM/CSS, or visual lookalike.

## Mandatory Web Component Reuse Gate

This gate applies to HTML-first, visual-first, and direct-HTML workflows and to
all Pixso fidelity modes. It is a blocking gate, not a preference.

1. Before page implementation, run `pnpm delivery:validate`, select one target
   framework, inspect the canonical component registry, and create
   `component-usage.json` using the format in
   `references/web-component-reuse-gate.md`.
2. Match every required control or reusable content structure to an exact
   registered `logicalName`, Variant, state, and slots before creating local
   markup. Use the real target-framework implementation even when its status is
   `partial`; disclose missing readiness dimensions instead of replacing it.
3. Import `@text-to-ui/components-html`, `@text-to-ui/components-react`, or
   `@text-to-ui/components-vue` in editable page source and compose the page
   from those exports or factories. Load canonical Tokens and shared styles.
4. Treat `data-component`, copied component DOM/CSS, matching class names,
   screenshots, historical outputs, and visual similarity as non-evidence.
   HTML-first means production HTML adapters first, not handwritten static HTML.
5. Create a page-owned component only after registry discovery proves the
   capability is missing. Record queries, reviewed candidates, rejection
   reasons, and promotion disposition. If the capability is generally
   reusable, add it to the shared contracts and component package first.
6. Before browser QA and delivery, run
   `node text-to-ui/scripts/validate-web-component-reuse.mjs --manifest ... --project-root ...`.
   A failure blocks delivery. Keep editable source and `component-usage.json`
   even when the final artifact is bundled into one HTML file.

Web reuse and Pixso reuse are separate. Fast Pixso import may use page-owned
Frames, but it never relaxes the Web component-package import requirement.

For HTML-first and visual-first tasks, record a Pixso fidelity target. Use
**fast visual import** by default when the goal is a quick editable visual
Frame. Use **strict structured reuse** only when the user requires native
NewComponents instances, complete Pixso Variable bindings, or reusable library
structure. A fast visual import may contain page-owned Frames and literal
imported values; never report it as strict component parity.

For every reusable page or every task that may produce both HTML and Pixso,
create one machine-readable `page-spec.json` before either renderer runs. Read
`references/dual-output-contract.md`, start from
`assets/design-system/page-spec.schema.json`, and validate the result with
`node scripts/validate-page-spec.mjs /absolute/path/to/page-spec.json`. Pixso
GUIDs and raw SVG geometry never belong in this contract.

For `schemaVersion: 2`, the page spec must also contain a
`constraintContract` with explicit `must`, `mustNot`, and acceptance checks plus
`provenance`. Before rendering, assign a fresh `runId` and run
`node scripts/stamp-page-contract.mjs --page-spec ... --run-id ...`; this writes
the canonical `pageSpecSha256`. After each renderer or artifact update, stamp
the produced HTML and JSON evidence, then run
`node scripts/validate-page-contract.mjs` with the final artifacts. A page-spec
edit invalidates the previous hash and all artifacts must be regenerated or
re-stamped in the same run.

Before every design or implementation, inspect the bundled baseline in `assets/design-system/`. Read `assets/design-system/design.md` for human rules and use its CSS/JSON token files as machine-readable truth. A project-supplied Pixso component library or approved design system may override the bundled baseline according to the authority domains in `references/design-system.md`.

Default final delivery folder:

`/Users/zhaobohai/Desktop/资源管理/我的代码仓/`

If this path is outside the current sandbox, request filesystem approval before writing or copying final files there.

Treat this folder as the canonical user-facing storage location. Create a clear project subfolder inside it and sync all final designs, tokens, skill packages, assets, and code there before delivery. Workspace `outputs/` files are working mirrors only and do not replace the canonical copy.

## Workflow Routing

Determine whether the user has already explicitly selected a workflow in the current request:

- Phrases such as “先生成 HTML 初稿”, “HTML 导入 Pixso”, “代码转设计稿”, “先看页面结构再细化”, or “完整闭环” select **HTML-first refinement**.
- Phrases such as “先出效果图”, “先确认设计”, “先做 Pixso”, or “基于修改后的效果图生成 HTML” select **visual-first**.
- Phrases such as “直接生成 HTML”, “不要效果图”, “跳过 Pixso”, or “直接写可交互页面” select **direct HTML**.

If the user has not clearly selected one, choose **HTML-first refinement** and state this non-blocking assumption in the Tool Task Brief:

> 默认采用首推流程：先生成并检查 HTML 初稿，再导入 Pixso 细化，最后基于确认后的设计生成和验证可交互 Demo。你可以随时改为 Pixso 优先或直接生成 HTML。

Do not ask a blocking workflow-selection question when the preferred default is safe. Honor an explicit mode, record the selected or defaulted mode in the requirement contract, and keep it fixed unless the user changes it.

## Requirement Confirmation Gate

After inspecting the request and available sources, but before creating or modifying
any page, HTML, Pixso Frame, or generated code, present a concise proposed solution
and ask the user to confirm it. This is a design-scope confirmation, not a workflow
selection questionnaire. The proposal must cover:

- **Design goal:** the user's primary job, work object, and intended outcome.
- **Page structure:** shell or layout pattern, main regions, hierarchy, content
  density, and where the primary action lives. Always show this as a compact
  tree so the user can confirm the screen/page hierarchy before generation. Use
  ASCII branches such as:
  ```text
  ├── 登录
  ├── 注册
  └── 找回密码
  ```
  For a single screen, show the screen as the root; for nested flows, show the
  parent page and its child pages or panels with the same tree notation.
- **Key interactions:** the primary path plus essential selected, hover, focus,
  loading, empty, error, disabled, overlay, and recovery states that matter.
- **Technology choice:** selected workflow, output form (single HTML, React, Vue,
  or existing project stack), browser checkpoint, and whether Pixso refinement is
  included.
- **Pixso fidelity target:** `fast visual import` (default) or `strict structured
  reuse`; state whether NewComponents and native linked instances are required.
- **Assumptions and open questions:** only decisions that could materially change
  the structure, behavior, delivery, or reuse strategy.

Use the template in `references/requirement-spec.md`. Keep it short enough to review
in one message; do not make the user fill out a long form. Ask at most three
high-impact follow-up questions in the same message when necessary. Do not start
HTML, Pixso, image generation, or code generation while confirmation is pending.

Treat an explicit “确认/可以/按这个做” as approval. If the user corrects any part,
update the proposal and request confirmation again. Record the confirmed proposal
and confirmation status in the requirement contract before entering the selected
workflow. This gate applies to HTML-first, visual-first, and direct-HTML runs.

## Pixso Fidelity Modes

Treat Pixso fidelity as a target inside `html-first` or `visual-first`, not as a
fourth workflow. Record the target in the requirement contract and map it to the
page specification as follows.

### Fast visual import (default)

Use `componentContract.reuseStrategy: "import-and-repair"` and
`strictComponentParity: false`. Validate the page spec and browser-check the
HTML, create the Pixso-specific inline-SVG copy, then call `code_to_design` once
to import the composed screen. NewComponents is not a prerequisite. Imported
colors, spacing, typography, and dimensions remain literals until a targeted
Token binding is read back and proven. An HTML `data-component` attribute is a
contract marker only; it does not become a Pixso Component instance. After the
visual import, optionally run the non-strict reuse planner and replace only
components whose exact Variant and slots can be proven. Report remaining
regions as page-owned content and do not claim strict parity.

The fast path still requires exact SVG provenance, visible icon wrappers, icon
crop QA, layout QA, and an honest record of Token bindings. It does not skip
SVG preparation merely because component-library auditing is deferred.

Before `code_to_design`, run `scripts/validate-pixso-import-package.mjs --mode fast` on the exact ZIP that will be imported. The package must have one static HTML entry, resolvable local assets, the confirmed state/canvas markers, and the required static content. A fast package may contain page-owned Frames and literals, but its report must not claim native Component or complete Variable parity.

### Dynamic-content import gate (failure-derived)

`code_to_design` consumes the submitted HTML/CSS/SVG snapshot. It does not
execute page scripts, wait for hydration, call APIs, or run event handlers. A
browser screenshot can therefore show a complete app while Pixso receives only
the static shell, titlebar, and empty runtime containers.

Before the first Pixso write:

1. Identify every runtime-populated region in the page contract, such as a
   mail list, detail pane, table body, chart, or activity feed.
2. Run an import-copy preflight at `1728 × 1152px` against the exact
   `pixso-import.html` (and the HTML entry inside the zip), not only the
   browser draft. For each required selector, record child count, visible text
   length, and non-zero bounding dimensions. A required dynamic region with
   zero children or zero visible content fails the gate.
3. Materialize a Pixso-only static snapshot before importing. Prefer
   server-rendered/static markup; otherwise serialize the hydrated DOM after
   the browser checkpoint into a separate import copy while preserving the
   canonical CSS Tokens and exact inline SVG source. Do not pass a
   runtime-only shell to Pixso.
4. Call `code_to_design` once only after the snapshot gate passes. If the first
   Pixso screenshot is blank in a required dynamic region, classify the issue
   as `importSnapshotFailure`, stop page-scale `apply_design` reconstruction,
   repair the import artifact, and record any corrected import as a new
   canonical candidate because `code_to_design` is additive. Do not spend a
   long sequence of live Pixso edits recreating a page that was absent from the
   import snapshot.

If static materialization is genuinely impossible, a page-owned static repair
is allowed only as a small, explicitly recorded fallback after the import
failure is proven. It must not be described as native Component parity.

### Pixso `apply_design` canary contract (failure-derived)

The live Pixso MCP schema is authoritative, but the current parser has several
non-obvious write rules. Before any batch edit, insert one canary node and read
it back with `get_node_dsl`; only scale the batch after the canary proves the
fields below:

- Literal text content is written with `nodeText` in `I`/`U`. In the current
  Pixso MCP environment, `characters`, `content`, and a nested `text` object
  can create an empty text node or be ignored.
- Absolute placement at insertion uses `left` and `top` under a
  `layoutMode: "NONE"` parent. `x`/`y` were ignored by the current parser, and
  `U` is not a reliable coordinate-repair operation. If a local frame is
  mispositioned, rebuild that local parent with proven `left`/`top` values
  instead of mass-editing children.
- New text needs an explicit Token paint. Use
  `fillPaints: "$token"`/`strokePaints: "$token"`, then verify `colorVar` or
  `variablesAlias` in the read-back. For `set_bound_variables`, put `guid`
  inside each binding item and use the `$token` path as `variable.id`; a local
  numeric Variable GUID is not the same write payload.
- Do not make `cornerRadius: 0` a required property of a newly inserted
  section Frame. In the current parser, combining it with other insertion
  properties produced invalid `0 × 0` containers; create and size the Frame
  first, then apply non-zero radius or other decoration as a separate proven
  correction.
- Keep each `apply_design` call at no more than 50 operations. After every
  batch, read back representative text, position, Token, and instance nodes.
  A successful tool response alone is not proof that the visual content was
  written.

### Strict structured reuse

Use `componentContract.reuseStrategy: "registered-components"`,
`strictComponentParity: true`, and `libraryPage: "NewComponents"`. Read
`references/registered-reuse-mode.md`, run the strict reuse planner, verify the
source library on NewComponents, and insert linked instances on the target
product page. Use `code_to_design` only for Pattern geometry and page-owned
content when registered regions are in scope. A missing, stale, or unverified
component is a hard stop for this mode; preserve the HTML draft and report the
exact library repair needed.

For either mode, use one grouped discovery pass, one bounded
`code_to_design` call, targeted read-backs, and no re-import for incremental
fixes. `code_to_design` imports geometry; it does not automatically create
native Components or bind Variables.

When strict structured reuse is selected, run:

```bash
node scripts/plan-registered-reuse.mjs \
  --page-spec /absolute/path/to/page-spec.json \
  --out /absolute/path/to/registered-reuse-plan.json
```

Resolve verified components before rendering. Web renderers call the registered
framework adapter; Pixso inserts the exact linked instance. Use `code_to_design`
only once for Pattern geometry and page-only content, then apply the generated
reuse plan. Never manually restyle a registered instance on each page. Run the
planner with `--strict` before claiming strict component parity.

NewComponents is the source-library phase, not the required target page for the
final product screen. Resolve and repair there first, then switch to the target
product page and insert linked instances. The planner is a Pixso gate only in
strict structured reuse; in fast visual import it is advisory and must not block
the initial Frame.

Strict structured reuse also requires `scripts/validate-pixso-import-package.mjs --mode strict` before any Pixso write. The strict ZIP must carry the semantic `px-key:` markers and consume canonical color CSS variables with no authored hex/RGB/HSL colors. After import, every color-bearing Pixso node must read back a Color collection `$variable`; every registered region must read back as a real linked `instance` with a verified Variant and editable slots. A missing component, slot, variable, page identity, or read-back proof stops this channel; do not silently fall back to fast visual import.

Read references/html-draft-delivery.md before generating HTML and
references/pixso-performance.md before the first Pixso call. The HTML draft
must be opened and reported as a visible checkpoint before Pixso starts.

## Shared Workflow

1. **Parse the request after mode selection**
   - Identify application view type, user, work object, primary task, frequency, risk, language, style, required components, desktop window targets, workflows, states, and deliverable format.
   - If the request is only one sentence, use approved defaults and model reasoning instead of forcing a form.
   - Read `references/requirement-spec.md` and `references/tool-design-intelligence.md`. Inspect supplied materials before asking anything.
   - Classify exactly one primary tool type and at most one secondary type from the user's job and work object, not from visual resemblance.
   - Ask only 1–3 high-impact questions in one default round when the answers would materially change the tool structure, primary workflow, risk behavior, or demonstration scope.
   - Do not ask for known information. Infer low-risk details and record material assumptions.
   - Read `references/input-checklist.md` when the user wants the workflow, prompt template, or asks what materials improve controllability.
   - Show the analyzed proposed solution defined in the Requirement Confirmation Gate: design goal, page structure, key interactions, technology choice, and material assumptions.
   - Ask for explicit confirmation before generating any page artifact. If the user corrects the proposal, revise it and confirm again.
   - After confirmation, write the compact requirement contract defined in `references/requirement-spec.md` before Pixso or HTML generation. Include the selected workflow, Tool Task Brief, proposed solution, and confirmation status. For multi-view, reusable, extension, or redesign work, also create `design-strategy.md`.
   - Translate every confirmed hard requirement into `page-spec.json.constraintContract`: put required structure, states, and interactions in `must`/`acceptance`, forbidden content or fallback behavior in `mustNot`, and list the exact evidence artifacts needed to accept the run. Do not leave a requirement only in prose.

2. **Understand the product**
   - Before designing, establish the user, work object, primary job, start and success states, action scopes, information priority, failure/recovery behavior, and state that must be preserved.
   - Apply the type baseline and module overrides from `references/tool-design-intelligence.md`. Do not give the entire page one global “expressive” or “strict” treatment.
   - Keep shell, navigation, filters, tables, permissions, publishing, logs, and dangerous actions operational even when preview, media, content, or empty-state modules use stronger expression.
   - Derive the simplest suitable page structure from the workflow before selecting HarmonyOS panes, visual tokens, or components.
   - For existing projects, inspect current product code, assets, routes, screenshots, and brand files before inventing a new visual language. Do not inspect or copy previous generated outputs unless the user explicitly asks to continue that exact artifact.
   - For new projects, infer a coherent tool context and state assumptions briefly.

3. **Establish the design system**
   - Classify the design-system state as `authoritative`, `partial`, `conflicted`, or `absent`, then follow the action and authority domains in `references/design-system.md`.
   - Reuse an existing component library, style library, Pixso library, CSS tokens, or `design.md` when present.
   - If none exists, create a small local design system before building pages: colors, typography, spacing, radius, shadows, surfaces, buttons, inputs, cards, navigation, tables/charts as needed.
   - Treat the design system as the source of consistency for Pixso and HTML in HTML-first refinement and visual-first modes, and for the HTML implementation in direct-HTML mode.
   - Read `references/design-system.md` when creating or reusing visual foundations.
   - Read `references/icon-selection.md` before selecting, replacing, or adding component and page icons. Reusable components bind semantic aliases, never an unreviewed raw library filename. Resolve Lucide icons through `assets/icons/icon-aliases.json` and generate their exact source geometry with `scripts/export-icon-sprite.mjs`; never hand-author or approximate a Lucide path that exists in the installed package. For Pixso, also read `assets/design-system/pixso-icon-map.json` and pass `node scripts/validate-pixso-icon-map.mjs`; new Text to UI nodes must use the same exact SVG source and target-size mapping as HTML, never `HM Symbol` or `icon_font`.
   - Treat 24×24 as the icon source artboard, not the default display size. The page specification must declare `displaySizeToken` and the resolved 16px, 20px, or explicitly approved 24px display size. In Pixso, resize the SVG root and its internal vector geometry together; shrinking only the outer Frame fails QA.
   - Apply the outline icon stroke rule by resolved display size: 24px uses 1.5px, 20px uses 1.25px, and 16px uses 1px. Keep 1.5px as the source stroke on the 24×24 artboard and obtain smaller effective widths by uniform scaling; do not set a page-level stroke override. Filled HarmonyOS glyphs retain source geometry and do not receive a stroke.
   - Read `references/layout-system.md` before composing application shells, page grids, sidebars, titlebars, or resize behavior.
   - Read `references/harmonyos-layout-patterns.md` to select the simplest native desktop shell that supports the workflow, including the approved secondary-page pattern when a task drills into child settings or detail flows.
   - Inspect `assets/harmonyos-layout-references/reference-manifest.md` and only the relevant screenshots when native layout evidence is needed. Use them as structural references, not reusable visual assets.
   - Always start from `assets/design-system/`; override it only with higher-authority project sources.
   - For baseline color work, use only the 56 core variables in `assets/design-system/core-color-token-table.md`: Brand, Neutral Dark, Neutral Light, Function, and Multi. Bind Pixso layers directly to these variables; do not create additional semantic color variables. The only approved duplicate values are `multi/09–11`, which intentionally repeat the opaque success, danger, and warning colors for categorical use.
   - For every other Pixso variable, use only the primitive foundation set in `assets/design-system/core-foundation-token-table.md`: `space/*`, `size/*`, `radius/*`, `layout/*`, `opacity/*`, and atomic `font/*`. Component and product semantics stay in CSS/JSON and resolve through `assets/design-system/token-runtime-map.json`; never create Pixso `gap/*`, `padding/*`, component-size, component-radius, or typography-style aliases.
   - Treat opacity as a platform-unit exception: Pixso `opacity/40` stores the percentage number `40`, while HTML/CSS resolves the same semantic value to `0.4`. Never write `0.4` into the Pixso opacity variable or `40` into CSS `opacity`.
   - React, Vue, Tailwind, and compiled single-file bundles must still consume the canonical Web CSS variables. Framework palette classes are implementation residue, not Tokens. Map them at the component selector/state boundary, record each selector/property/variable in `tokenContract.webCoverage`, and keep icons on `currentColor`. Never remap an entire framework palette globally when the same shade is used for different semantic roles. For React or compiled React/Tailwind output, read `references/react-token-mapping.md`; for Vue, read `references/vue-token-mapping.md`.
   - For Tailwind-like HTML output, use the generated `assets/design-system/tokens.utility.css` and `token-utility-map.json`. Utility Classes use the `u-` prefix (`u-bg-*`, `u-text-*`, `u-gap-*`, `u-p-*`, `u-type-*`) and resolve only to canonical CSS variables; arbitrary values, hex colors, and framework palette guesses are forbidden. Keep Pixso mapping on a separate `data-px-key="..."` semantic marker. A Class controls HTML rendering; the semantic key controls Pixso binding.
   - When a page or fixture spans React, Vue, or static HTML, read `references/framework-component-mapping.md`. Give all renderers one logical component contract and one shared Tokenized component stylesheet; in the user-facing gallery, place HTML / React / Vue as first-level tabs that replace the renderer inside the same catalog, not as links to nested pages. Every tab must read the canonical registry order and render the complete registered catalog from its real source. Runtime cards show one default component only; do not pre-render a second state matrix, and rely on real pointer/keyboard interaction for Hover, Focus, Pressed, Selected, open, commit, cancel, and disabled behavior. A selector shown for the catalog promises that every visible component family has a real adapter for every offered framework; if coverage is partial, hide unsupported tabs or scope the selector. A registered module adapter may reuse one canonical matrix source, but React, Vue, and HTML must each load it through their real renderer and declare every included logical component. The component package may also expose explicit `framework-html.html`, `framework-react.html`, and `framework-vue.html` entries for developer-only single-framework debugging; these entries must read the same registry and must not become a second user-facing catalog. After changing an adapter, rebuild and publish the served preview artifact, then verify the loaded frame's logical contract, card order, and default rendering; a `ready` label or a cached fallback shell is not proof of coverage. Run the gallery's actual interaction audit across all loaded framework renderers: source handler checks alone do not prove open, keyboard, commit, cancel, Escape, external-close, disabled, state-persistence, or post-mount behavior. Never add three hand-drawn lookalikes or claim a framework from sample content alone.
   - Read `packages/component-contracts/src/components.json` before selecting a reusable component. `status: ready` means independent HTML/React/Vue source, states, editable slots, canonical Token consumption, and visual QA are all verified. `status: partial` still requires the real source adapter when `sourceReady` and the selected framework implementation exist; disclose the unverified readiness dimensions and do not claim full parity. A partial status never authorizes a handwritten replacement. If source or the selected implementation is missing, record a blocked component gap. Respect each contract's `sourceStrategy`: reuse canonical Skill structure for simple components, use shadcn/shadcn-vue only as behavior foundations for complex interaction, and always apply `@text-to-ui/component-styles` over the library defaults.
   - For strict structured reuse, run `plan-registered-reuse.mjs --strict` after page-spec validation and before either renderer. Treat `verified` as directly reusable, `mapped-pending-verification` as a live-library task, `mapped-needs-rebuild` as a shared-library repair, and `missing-target` as a component gap. For fast visual import, do not defer the HTML/Pixso import behind this audit; optionally run the planner without `--strict` after the visual Frame exists to identify safe replacements.

### Canonical Pixso Frame and Pattern/Component Gate

- `code_to_design` is additive: every call creates a new editable Frame and does not update the previous one. Record one `canonicalFrameId` and `canonicalFrameName` in the audit. After the first import, use live `apply_design`, `replace_props`, linked-instance replacement, and read-back on that Frame; do not re-import for incremental Token, Pattern, or copy fixes. Older imports may be renamed as archive references, but do not count them as current output or delete them without a separately verified deletion decision.
- A page-level selector or data attribute is only a contract marker. The Pixso audit must independently prove the canonical Frame's live hierarchy, `$variable` read-back, component `type: instance`/`mainComponent`, editable content properties, and Pattern structure. A same-name Frame, `icon_font`, detached node, or runtime-only adapter is not a registered component and cannot raise `strictComponentParity`.
- In fast visual import, the canonical Frame may be page-owned and may contain literal imported values; record the bindings that were actually proven and do not elevate the Frame to strict parity. In strict structured reuse, every claimed registered region must pass the live instance and Variable audits.
- Before repairing or creating a registered component, enumerate Pixso pages with `get_top_level_frames({type: "page"})`, read the active page from `fetch_context`, and compare it with each component's `containing_frame.pageName` from `get_all_components`/`read_components`. A component listed from another page (for example `NewComponents` while the active page is `Coremail`) is discovery evidence only; it is not permission to mutate that page. Mark the audit `activePageMismatch`, keep strict parity blocked, and ask for the target library page to be opened/focused before applying edits. Never send a colliding node ID from another page to `apply_design` or treat a same-name source variant as a registered target.
- The `Primary Navigation Shell` Pattern is a two-level contract: an app-level navigation (for example mail, calendar, contacts, settings) and the product/mailbox navigation below it. Both levels share the sidebar surface Token; the app-level region has the navigation divider Token, uses filled semantic SVG aliases with `currentColor`, and exposes selected/default/hover states. The React, Vue, static HTML, and Pixso adapters must declare the same levels, item order, state axes, and Token roles; do not replace the Pattern with a bottom-only icon row. The shell also has an explicit expanded/collapsed state independent of navigation level: expanded width is 240px; collapsed width is 64px; collapsing hides the application Logo mark and name (do not substitute a mini Logo), hides route labels, preserves icon controls and selection, and places the 40px expand control in the former Logo slot. The collapse/expand pair must expose `aria-expanded` and `aria-controls` and preserve keyboard focus transfer.
- Imported CSS values are considered literal until `query_nodes` shows the mapped Pixso `$variable`. Transparent mask-wrapper paints may be recorded as intrinsic alpha, but all other color-bearing nodes must be bound. If code-to-design converts a semantic SVG into `icon_font` or a component slot cannot be edited, keep strict mode blocked and repair the registry/component library instead of redrawing a page-level imitation.
- Dual-output validation must follow local relative `<link rel="stylesheet">` references in compiled Web output (including Vite `dist` bundles). Use linked CSS for Token declarations, `var()` consumption, and `webCoverage` selector matching; scan only authored inline CSS for literal-value errors when a linked bundle contains framework reset/utility layers. Keep `webUsageRequired: false` explicit for foundation Tokens declared by the shared stylesheet but intentionally unused by the current page; never use it to hide a consumed component Token or a Pattern rule.
- Pixso color coverage may account for explicitly recorded intrinsic transparent mask-wrapper paints: `variableBoundColorNodes === colorBearingNodes` or `variableBoundColorNodes + intrinsicAlphaPaints === colorBearingNodes`. Any opaque or non-mask paint remains required to read back a `$variable`.
   - Use `assets/design-system/typography-style-map.json` as the required HTML-to-Pixso typography bridge. Generate new visible text only from its 12 formal roles, normalize HTML to `--font-sans`, and bind Pixso text to the corresponding `Typography/*` shared Text Style. Do not use imported `Typography/Component/*` styles for new page text.
   - Use `assets/design-system/effect-style-map.json` as the required HTML-to-Pixso effect bridge. Pixso exposes only `Effect/Foundation/shadow-1` through `shadow-6`; resolve semantic effect roles to that one physical set and never create duplicate `Effect/Semantic/*` styles. Do not use imported `Effect/Component/*` styles for new page content.
   - When reviewing or changing shared tokens and component styling, open `preview/component-gallery.html`. Use it as the visual regression surface for component sizes, states, surface contexts, overlays, and interaction feedback.
   - When modifying this Skill itself, read `references/skill-update-workflow.md` and follow its release gate. Refresh preview dependency fingerprints with `python3 scripts/update_preview_cache.py --write`; never validate only a dedicated test page or only a local-server copy when the user is viewing another path.
   - Read `references/component-coverage.md` when extending the shared component system. Treat it as the gap map between the official shadcn directory and the bundled HarmonyOS PC gallery, then update it when a component moves from missing or partial to covered.
   - Read `references/component-specs-extended.md` for navigation/disclosure, overlay/command, form composition, loading/date, and specialized content components. A component is not covered until its rules and a working gallery example both exist.

## HTML-First Refinement Workflow

Use these steps for the preferred `html-first` mode.

4. **Create and check the HTML draft**
   - Enter this step only after the Requirement Confirmation Gate is confirmed.
   - Choose the implementation strategy needed to render the agreed page structure, but keep this pass easy to revise.
   - Generate the draft from the validated `page-spec.json`, canonical CSS Tokens, registered logical component IDs, `component-usage.json`, and the requirement contract.
   - Import and render the real selected-framework component package. Page code may compose Patterns, domain data, and page-owned content, but it must not reproduce registered component internals.
   - Run `validate-web-component-reuse.mjs` before opening the browser checkpoint. A single-file HTML draft must be a bundle of component-backed editable source, never an independently handwritten implementation.
   - Implement enough real behavior to verify navigation, information hierarchy, the primary workflow, overlays, and critical states. Do not spend time polishing details that Pixso is meant to refine.
   - Read `references/pixso-visual-parity.md`, calibrate the browser's physical viewport to a verified `1728 × 1152 CSS px`, then open the actual draft at that CSS viewport. Exercise the primary path, inspect a screenshot, and fix structural defects before import.
   - Run `scripts/verify-html-artifact.mjs` and `scripts/validate-visual-parity.mjs` against the delivery file and its manifest, open that exact HTML at the verified CSS viewport, and capture the draft screenshot. The manifest must record the state ID and the calibration result.
   - Report the clickable draft path, browser URL, viewport, and verification
     result before any Pixso call. Continue to Pixso only after this visible
     checkpoint, unless the user corrects the structure or explicitly changes
     workflow.

5. **Import and refine in Pixso**
   - Read `references/pixso-mcp.md` and inspect the live Pixso tool schemas before the first write.
   - Read references/pixso-performance.md. Keep Pixso running with the
     intended design file active. If Pixso is unavailable, slow beyond the
     bounded retry, or the target page is not active, preserve and report the
     verified draft, then pause for Pixso availability or an explicit switch
     to direct HTML.
   - Record the destination before the first Pixso call: `targetPageName`,
     `targetPageId`, `targetFrameScope`, `libraryPageName`, `sourceFrameId`,
     and the absolute browser/import artifact paths. Keep local file paths,
     Pixso page IDs, and node GUIDs as separate identities; never infer one
     from the current selection, a same-name Frame, an import ZIP, or a cached
     GUID.
   - Use the exact browser-checked static import copy and the same
     `data-visual-state-id` for Pixso. Do not compare a hydrated browser state
     with a different account, selected row, scroll position, or runtime-only
     import shell.
   - Before every Pixso write (`code_to_design`, `apply_design`, linked-instance
     insertion, Variable binding, replacement, or deletion), re-read
     `fetch_context` and enumerate pages with `get_top_level_frames({type:"page"})`.
     Require an exact active-page match to `targetPageName` (or to
     `libraryPageName` during source resolution). A missing, ambiguous, stale,
     or mismatched page/path is a hard stop: do not try the current page and do
     not send a node from another page to a write tool.
   - Route by the recorded Pixso fidelity target. In fast visual import, do not
     run a strict library gate or require NewComponents before the first Pixso
     call: create the Pixso-specific inline-SVG copy and import the full
     browser-checked draft once. In strict structured reuse, run
     `plan-registered-reuse.mjs --strict`, confirm the active Pixso page is
     exactly NewComponents, verify the source components, re-read the active
     page, then switch to the target product page and re-run the same page
     check before linked-instance creation. A library-phase mismatch,
     unverified mapping, stale GUID, or missing linked instance is a hard stop
     only in strict mode. If page switching is unavailable, ask the user to
     focus the exact page and confirm it; after confirmation, verify again.
   - In strict mode, if the reuse plan contains registered regions, import only
     a low-complexity Pattern skeleton and page-owned content with
     `code_to_design`; do not import the full HTML composition as a second
     component renderer. In fast mode, import the full draft once.
   - Before either import, run `scripts/validate-pixso-import-package.mjs` with
     the recorded `--mode fast` or `--mode strict` against the exact ZIP entry,
     then complete the Dynamic-content import gate above against the exact
     Pixso HTML copy. Immediately after `code_to_design`,
     take one screenshot and read back one representative node from every
     required dynamic region before attempting any `apply_design` repair. A
     blank list/detail/chart at this checkpoint is an import snapshot failure,
     not a reason to begin page-scale Pixso reconstruction.
   - Treat imported values as literals until live read-back proves Variable or Style bindings. In strict mode, bind every mapped Token, ensure every color-bearing node uses a Color collection variable, replace registered atomic controls with linked instances, restore rule-governed Auto Layout, and correct page-only details. For every linked replacement made with `apply_design`, include `type:"instance"` and the real registered variant GUID in `ref`; a same-name Frame is not a linked component. Re-read `type`, `mainComponent`, `overrideKey`, and `propRefMap`. For color, write `$token` through `fillPaints`/`strokePaints` and verify it with `query_nodes`; use the range-paint plugin only for mixed-color TextNode ranges. In fast mode, bind only requested/proven targets and list every remaining literal explicitly.
   - Keep page Token binding separate from component-library repair. For the MVP page lane, use `scripts/pixso-page-binding-bridge-plugin`: first run its read-only preflight on the exact active `coremail` page and selected canonical Frame, then batch-bind only the explicit semantic keys in `page-binding-manifest.json`, then run its read-only audit. The bridge never changes page focus, writes `NewComponents`, replaces components, uses cached GUIDs, or infers a Token from a hex color or node position. A managed binding counts as successful only after Pixso read-back proves the Variable; its audit denominator is explicitly `coverageScope: "managed-bindings"`, so it must not be presented as a full-page strict audit.
   - Materialize each semantic page target in the Pixso import copy with `data-px-key="..."` and Token Classes from `token-utility-map.json`, then run `scripts/prepare-pixso-binding-html.mjs --utility-map assets/design-system/token-utility-map.json` after `prepare-pixso-html.mjs`. The semantic marker is the bridge between HTML and the imported Pixso layer; Pixso may not preserve CSS Class names, so never use a Class as the sole binding key. If the semantic marker is missing, duplicated, or the target Frame is ambiguous, stop and fix the artifact instead of guessing.
   - Use the `apply_design` canary contract before any local correction. Keep
     source-import timing, screenshot diagnosis, and repair timing separate;
     report the raw `code_to_design` duration instead of attributing later
     manual repair time to the importer.
   - Add or refine the visual states that the final demo must support. Use `apply_design` only for bindings, linked-instance replacement, Auto Layout restoration, and local corrections.
   - Run layout checks, screenshot QA, icon crop QA, and Tool Design Reasoning
     QA before requesting approval. In strict mode also run the complete Pixso
     binding and linked-component audits. In fast mode audit only the Token
     bindings actually requested and proven, and list remaining literals as
     known limits. Record Pixso call count, slowest call, code_to_design
     duration, repair duration/call count, node count, retries, and whether the
     performance budget aborted the stage. Verify that temporary canary/test
     nodes are deleted and that the final audit points to the final Frame, not
     an earlier additive import.
   - Pause at the Pixso approval checkpoint. Repeat refinement and QA until the user confirms the design.

6. **Re-read and synchronize the confirmed design**
   - Immediately before final implementation, re-read the current Pixso page and top-level Frame.
   - Treat user edits as authoritative. Synchronize approved hierarchy, content, state, and interaction changes into `page-spec.json`; do not patch the original draft blindly.
   - Record the Pixso page, Frame name, GUID, and URL when available.

## Visual-First Workflow

Use these steps only when the user selects visual-first.

4. **Create the high-fidelity visual**
   - Enter this step only after the Requirement Confirmation Gate is confirmed.
   - Use Pixso as the only default editable high-fidelity design target. Do not create or update Sketch or Figma files unless the user explicitly overrides this rule for that request.
   - Before writing, inspect the callable tools exposed by the configured `pixso` MCP server. Use their actual schemas; do not invent Pixso tool names or parameters.
   - Read `references/pixso-mcp.md` before the first Pixso read or write in a task. Run `node scripts/build-pixso-token-manifest.mjs --check`, `node scripts/build-token-runtime-map.mjs --check`, `node scripts/build-dual-output-token-map.mjs --check`, `node scripts/build-token-utility-map.mjs --check`, and `node scripts/validate-token-utility-map.mjs assets/design-system/token-utility-map.json`; all five must describe the same 127-variable baseline before creating any reusable Pixso component or pattern.
   - Read `references/pixso-component-usage.md`, `references/pixso-component-maintenance.md`, `assets/design-system/pixso-component-registry.json`, and `assets/design-system/pixso-component-specs.json` before composing or repairing Pixso components. Resolve registered components by exact name and create linked instances; never redraw, detach, or locally restyle an available registered component.
   - When HarmonyOS native components are the source library, run `node scripts/build-harmonyos-component-mapping-table.mjs --check` and read `assets/design-system/harmonyos-component-mapping-table.json`. Partial mapping is allowed, but strict parity requires every component used by the current page to be `verified`; `mapped-*` and `missing-target` rows remain non-strict.
   - Also read `assets/design-system/pixso-component-migration.json`. Never delete a resource whose `origin` is `harmonyos-native`. A generated component can be deleted only when its status is `superseded`, its exact name is present in `deletionAllowlist`, its live instance count is zero, and its GUID has just been re-read.
   - If Pixso MCP is unavailable, ask the user to open Pixso, open the target design file, and start its MCP service. Continue with HTML only if the user explicitly switches to direct-HTML mode; never silently fall back to another mode, Sketch, or Figma.
   - Build the actual UI as the first screen, not a marketing explanation of the UI.
   - Target HarmonyOS PC desktop by default. Do not add mobile previews unless the user explicitly changes the project scope.
   - Use real UI states and content: labels, realistic sample data, controls, empty/error/success affordances when relevant.
   - Build pages from the established component/style system rather than one-off styling.
   - Use the same validated page-spec.json to produce a temporary static HTML
     layout. Run the strict registered-reuse planner and confirm NewComponents
     is active before writing. When registered regions exist, import only a
     Pattern skeleton and page-owned content with code_to_design; keep
     Shell/Pane/List Detail structures as rule-generated Auto Layout Frames,
     then use apply_design only for Token binding, linked atomic-instance
     replacement, and local corrections.
   - Use a default top-level Frame of `1728 × 1152px` and represent all interactions that the frontend demonstration must support.
   - Read `references/interaction-spec.md` and define the key interaction records before finalizing Pixso states or prototype connections.

5. **QA and request visual approval**
   - Always screenshot the Pixso top-level Frame when tooling allows.
   - Check for text overlap, clipped labels, weak contrast, accidental one-color palettes, desktop window overflow, and awkward spacing.
   - Fix issues before finalizing.
   - Run `references/tool-design-qa.md` before visual polish. Repair structural task, workflow, action-scope, state-preservation, or module-profile problems before fixing decorative details.
   - Read `references/visual-qa.md` for the QA checklist.
   - Report the Pixso page name, top-level Frame name, and node GUID before starting HTML; include a Pixso URL when the MCP or user provides one.
   - Pause at the Pixso approval checkpoint so the user can inspect or manually adjust the editable design.
   - Do not begin HTML until the user explicitly confirms the visual or says its revisions are complete.
   - If the user requests changes, update or let the user update the visual, visually QA it again, and return to this approval checkpoint. Repeat until confirmed.

6. **Re-read the confirmed visual**
   - After approval and immediately before implementation, inspect the current Pixso document again through Pixso MCP.
   - Treat user edits made after the initial design pass as authoritative. Never implement from a stale screenshot, cached observation, or earlier Pixso state.

## HTML Implementation Workflow

Use these steps after Pixso approval in HTML-first refinement or visual-first mode, or immediately after shared steps 1–3 in direct-HTML mode.

7. **Choose implementation strategy**
   - For a one-view demonstration, default to a single browser-openable HTML file with embedded CSS and JavaScript.
   - For multi-page static work, use a project folder with `design.md`, `pages/`, `styles/`, and `assets/`.
   - For new reusable Next.js product projects, use shadcn/ui preset `b7ClMfrGK` as the component baseline when no existing stack conflicts.
   - Keep `design.md` and project tokens authoritative; map them over shadcn theme variables and component variants after initialization.
   - For existing projects, follow the existing stack and style system first.
   - Read `references/implementation-strategy.md` before creating multi-page output, Tailwind output, or project folders.
   - Read `references/shadcn-adapter.md` before initializing shadcn, applying the preset, or adapting shadcn components to project tokens.

8. **Implement HTML**
   - In HTML-first refinement mode, regenerate or refactor the draft from the synchronized `page-spec.json` and latest re-read Pixso state. Preserve useful implementation work, but never let stale draft structure override approved design changes.
   - In visual-first mode, implement the latest re-read and confirmed Pixso state.
   - In direct-HTML mode, implement directly from the requirement contract, approved sources, and established design system; do not create or require Pixso merely for parity.
   - Default to a browser-openable HTML file with embedded CSS and JavaScript unless the user asks for React/Vue/Next/etc.
   - Avoid external dependencies unless they are clearly useful and allowed.
   - Recreate the final visual direction with semantic HTML, desktop window-aware CSS, real form/control markup, and working interactions.
   - In HTML-first refinement and visual-first modes, match Pixso component states and layout behavior from the same source-of-truth rules; do not reinterpret the design as a web page.
   - Render from the latest validated `page-spec.json`. When an approved Pixso edit changes hierarchy, content, or interaction, synchronize that change into the specification before generating final HTML.
   - When generated framework `<script>` or `<style>` blocks are excluded as vendor output, the authored page layer must own every visible component color and metric through `tokenContract.webCoverage`; declaring or consuming each Token once is not sufficient evidence.
   - In React, prefer stable `data-component`, `data-state`, and semantic role attributes rendered directly from props/state. If only a compiled bundle is editable, add a component-boundary runtime adapter; never write resolved Token values into inline styles or map palette classes without a named component boundary. Read `references/react-token-mapping.md`.
   - In Vue, keep `page-spec.json` selectors independent of generated
     `data-v-*` attributes and CSS Module hashes. Attach stable
     `data-component` and `data-state` attributes in the template, consume
     canonical variables in the SFC style, and validate the compiled output.
   - Use `design.md`, design tokens, or the component/style library as implementation constraints when available.
   - If no `design.md` exists and this is a reusable project, create one alongside the HTML to document the visual system.
   - Read `references/html-output-rules.md` before writing the final HTML/CSS.
   - For every HTML output containing icons, declare the required semantic aliases, inject or emit the exact-source sprite with `node scripts/export-icon-sprite.mjs`, and run `node scripts/audit-icons.mjs --strict <html-file>` before delivery. Use `<svg><use href="#icon-..." /></svg>` instances that reference the generated symbols in the browser artifact. Before `code_to_design`, create a separate Pixso import copy with `node scripts/prepare-pixso-html.mjs --in <browser.html> --out <pixso.html> --strict`; pass that inline-SVG copy to Pixso so the hidden sprite is not converted into an empty wrapper. Do not bypass a failed audit by copying geometry manually.
   - Implement the agreed primary workflow and meaningful component states; a visually accurate but inert mockup is incomplete.
   - Use `references/interaction-spec.md` as the required behavior and interaction QA baseline.

9. **QA and deliver**
   - Open the actual HTML or local server, set the viewport to `1728 × 1152px`, exercise the primary interactions, and inspect screenshots when browser tooling is available.
   - In HTML-first refinement and visual-first modes, compare the final HTML against the confirmed Pixso design. In direct-HTML mode, compare it against the requirement contract and design-system rules.
   - Re-run the applicable tool-design reasoning checks after implementation. Do not let a visually accurate implementation reintroduce workflow, state-preservation, unsupported-content, or module-profile defects.
   - Stamp every final artifact from the same page spec and run, then run `scripts/validate-page-contract.mjs` with the final HTML, run manifest, delivery record, reuse plan, and Pixso audit. Treat any `mustNot`, acceptance, provenance, or artifact-metadata failure as a blocking defect.
   - Save final files under the default delivery folder when possible.
   - Also keep outputs in the current workspace `outputs/` when useful for traceability.
   - Final response must include the selected workflow, the local path to the final HTML, and the `design.md` or `design-strategy.md` paths when created or updated. In HTML-first refinement mode, also include the draft HTML path and Pixso page/Frame reference. In visual-first mode, include the Pixso page/Frame reference.
   - Mention any limitation honestly, such as an unavailable Pixso MCP service, an active-document mismatch, or inability to run visual QA.

## Completion Gate

Do not report completion until the shared checks and the checks for the selected mode pass.

Shared checks:

- The workflow is recorded as `html-first`, `visual-first`, or `direct-html`; an unqualified request defaults to `html-first`.
- Requirement contract exists, includes the Tool Task Brief, and matches the latest user request.
- Primary tool type, work object, primary workflow, action scopes, failure/recovery behavior, and required state preservation are recorded.
- Tool Design Reasoning QA has no blockers or structural issues and has a total score of 4 or lower.
- Interactive frontend opens or builds successfully.
- The bundled component gallery opens without console errors after shared token or component-rule changes.
- Every delivered HTML file containing icons passes `node scripts/audit-icons.mjs --strict <html-file>`; every Lucide symbol matches the installed package node data byte-for-byte after normalized serialization, and every non-Lucide icon carries approved source provenance.
- Primary workflow, hover, focus, error, disabled, selected, and overlay states work where relevant.
- Pointer, keyboard, focus, resize, recovery, and destructive-action behavior pass the applicable interaction rules.
- Final files are present in the canonical delivery folder.
- HTML-first always exposes a verified draft path and browser checkpoint before
  Pixso; run scripts/verify-html-artifact.mjs and keep the draft deliverable
  even when Pixso is unavailable or over budget.
- The HTML artifact guard has a negative test: scripts/test-verify-html-artifact.mjs
  rejects a missing local asset.
- After any Skill-internal token, component, pattern, or preview change, preview cache fingerprints pass `python3 scripts/update_preview_cache.py --check`.
- Every reusable or dual-output page specification passes `node scripts/validate-page-spec.mjs`.
- Every schema-version-2 page specification has a valid machine-readable constraint contract and provenance hash; the final artifact set passes `node scripts/validate-page-contract.mjs` with one matching `runId` and `pageSpecSha256`.
- The run manifest, HTML metadata, delivery record, reuse plan, and Pixso audit must all point to the supplied page spec; never mix evidence from another page-spec revision or prior run.
- Every page using `componentContract.reuseStrategy: registered-components` has a generated reuse plan. Strict delivery requires `node scripts/plan-registered-reuse.mjs --strict` to pass with `strictReady: true`.
- Pixso component provenance and deletion protection pass `node scripts/validate-pixso-component-migration.mjs`.
- The Pixso fidelity target is recorded. Fast visual import is not reported as
  strict component parity; strict structured reuse reports the NewComponents
  library page and linked-instance evidence.
- The exact Pixso ZIP passes `scripts/validate-pixso-import-package.mjs` in the
  selected `fast` or `strict` mode before `code_to_design`; strict delivery
  additionally proves every color-bearing Pixso node reads back a Color
  collection Variable and every claimed registered region is a linked
  NewComponents instance.
- The canonical Skill and installed mirror match byte-for-byte for every changed file, and the actual user-visible component gallery loads the new fingerprinted assets.

Visual-first checks:

- Pixso top-level Frame is editable, uses the approved rules, and is visually inspected.
- The user explicitly confirmed the final visual after any revisions.
- HTML was generated from the latest re-read Pixso state.
- HTML is compared against the confirmed Pixso design at `1728 × 1152px`.

HTML-first refinement checks:

- The initial HTML draft opens, represents the agreed structure and primary workflow, and is browser-inspected before Pixso import.
- The exact Pixso import copy passes the Dynamic-content import gate: every
  required runtime-populated region has non-empty static content and non-zero
  dimensions before `code_to_design` is called.
- The exact ZIP package passes the selected mode's entry, local-reference,
  state-marker, static-content, and path-safety checks; strict packages also
  pass semantic binding-marker and no-hardcoded-color checks.
- The inspected draft is imported once through `code_to_design` in fast visual
  import, or only as a Pattern skeleton when strict registered reuse is active.
- In strict mode, the reuse plan passes with libraryPage NewComponents; the
  library phase resolves source components there, and the target product page
  contains linked instances whose `mainComponent` still points back to that
  library page.
- Pixso icon crop QA passes: no clipped wrapper, sprite-use conversion, or
  icon_font node remains in generated content.
- Fast mode passes layout, visual, and icon QA and reports proven bindings plus
  remaining literals. Strict mode additionally passes complete Token-binding
  and linked-component checks before approval.
- The user explicitly confirms the refined Pixso design after any revisions.
- Approved Pixso changes are synchronized into `page-spec.json`.
- The final interactive demo is generated from the latest re-read Pixso state and compared against it at `1728 × 1152px`.

Direct-HTML checks:

- No Pixso approval or Pixso availability is treated as a prerequisite.
- HTML is compared against the requirement contract and design-system rules at `1728 × 1152px`.

## Tool Routing

- In HTML-first refinement and visual-first modes, use the callable tools exposed by the configured `pixso` MCP server at `http://127.0.0.1:3667/mcp`. Inspect the tool schemas before the first write.
- In HTML-first refinement and visual-first modes, build editable Pixso documents with top-level Frames. In strict structured reuse, also create linked components and instances, variables, shared styles, and Auto Layout where the available MCP tools support them; do not deliver a flattened screenshot as the editable design.
- Query and resolve the reusable component library before writing only in strict structured reuse. In fast visual import, library discovery is optional and cannot block the initial Frame; if a later replacement is attempted, resolve current GUIDs by exact names and prove the Variant and slots first.
- In HTML-first refinement and visual-first modes, prefer `fetch_context`, design-system inspection, `code_to_design` or `apply_design`, `check_layout`, and `take_screenshot` according to `references/pixso-mcp.md` and the live tool schemas.
- In HTML-first refinement and visual-first modes, Pixso and its MCP service must be running with the target design file open and active. If the endpoint or active design document is unavailable, report that exact limitation and do not route design writes to Sketch or Figma.
- For HTML verification, use the available in-app browser control workflow. Open the actual file or local server, set the viewport to `1728 × 1152px`, exercise the primary interactions, and inspect screenshots before delivery.
- If Pixso is unavailable in HTML-first refinement or visual-first mode, report the limitation and ask the user to start it or explicitly switch to direct-HTML mode. In HTML-first mode, preserve the verified draft as an interim artifact. Do not silently change modes.
- If browser verification is unavailable, record the limitation and do not claim that interaction or visual QA was completed.

## Defaults

- Platform: HarmonyOS PC desktop application.
- Generation canvas: use the HarmonyOS PC desktop `1728 × 1152px` canvas by default for every HTML draft, Pixso top-level Frame, screenshot, and final visual comparison. Use another desktop size only when the requirement contract explicitly approves an override and records that size.
- Mobile: out of scope unless the user explicitly changes the platform contract.
- Visual quality: high-fidelity product UI, not a wireframe.
- Copy: infer realistic English or Chinese copy from the user's language.
- Implementation: interactive single-file HTML/CSS/JavaScript for simple views; Next.js, TailwindCSS, and shadcn/ui preset `b7ClMfrGK` for reusable application projects when appropriate.
- Workflow: default to `html-first`; honor explicit `visual-first` or `direct-html` requests.
- Pixso fidelity: default to `fast visual import`; use `strict structured reuse` only when native NewComponents instances, complete Variable bindings, or reusable library structure are explicitly required.
- Consistency: create or reuse `design.md` for multi-page or reusable work.
- Assets: prefer CSS shapes, gradients, inline SVG, or generated bitmap assets only when they improve the result.
- File naming: use clear kebab-case names, for example `saas-login.html`, `admin-dashboard.html`, or `pricing-page.html`.

## Trigger Examples

- "text to ui，做一个 SaaS 登录页"
- "先生成 HTML 初稿，导入 Pixso 细化后再生成最终 Demo"
- "帮我从一句话做一个高保真页面，然后写成 HTML"
- "这个 Pixso 页面转成 HTML"
- "做一个后台首页效果图，并给我网页文件"
- "按我的流程先出图再生成代码"
- "不用出效果图，直接根据文本生成可交互 HTML"

## Guardrails

- Do not stop at a plan after the user confirms the proposed solution; produce the requested artifact. The only required pre-generation pause is the Requirement Confirmation Gate.
- Do not start artifact generation before the workflow is recorded; use `html-first` when the request is unqualified.
- Do not silently switch away from a recorded workflow. Applying the documented `html-first` default is allowed and must be stated in the Tool Task Brief.
- Do not make a generic landing page when the user requested an app screen or tool screen.
- Do not classify an operations workbench as a marketing or campaign page.
- Do not apply expressive treatment from preview, media, content, onboarding, or empty-state modules to tables, filters, permissions, publishing, logs, or dangerous actions.
- Do not select a HarmonyOS shell before the primary tool type, work object, and workflow are understood.
- Do not apply generic website or mobile patterns to the HarmonyOS desktop application unless explicitly requested.
- In HTML-first refinement and visual-first modes, do not let Pixso and HTML invent separate visual or interaction rules.
- Do not run the strict NewComponents/component-parity gate for fast visual import. Do not claim native Component or Token parity from an HTML `data-component` marker or a visually matching imported Frame.
- In HTML-first refinement and visual-first modes, do not generate final HTML from a stale draft or in-memory design after the user has had an opportunity to edit Pixso; re-read the current Pixso document first.
- Do not invoke Sketch or Figma for design generation unless the user explicitly requests that tool in the current task.
- Do not rely on the first render. Inspect screenshots or browser output when available.
- Do not place final user-facing files only in temporary folders.
- Do not overwrite files in the default delivery folder without checking if there is a name collision; use a new descriptive filename or ask if replacement matters.
- Do not copy a previous run's HTML, delivery record, reuse plan, or Pixso audit into a new run without stamping and validating it against the current page spec. A changed page spec requires a new `runId` and a new `pageSpecSha256`.
