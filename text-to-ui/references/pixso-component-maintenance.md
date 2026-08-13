# Pixso Component Maintenance

Use this workflow whenever the reusable components in “鸿蒙客户端设计规范”
are created, repaired, or synchronized with the bundled component gallery.

## Authority and generated specification

The component system has four authority layers:

1. `assets/design-system/tokens.*.json` owns primitive and semantic values.
2. `assets/design-system/design.md` and component references own semantic rules.
3. `preview/component-gallery.html` plus its CSS and approved SVG sources own the
   rendered component structure and visual regression result.
4. Pixso is a generated reusable representation of those rules.

Do not infer a Pixso component from its name alone. Build and check the
machine-readable contract first:

```bash
node scripts/build-pixso-component-specs.mjs
node scripts/build-pixso-component-specs.mjs --check
node scripts/validate-pixso-component-specs.mjs
```

The generated file is
`assets/design-system/pixso-component-specs.json`. It records the authoritative
preview selector, master and placement sizing behavior, height, Auto Layout
direction, text-style roles, nested groups, spacing tokens, and icon rules for
every registered component.

## Sizing contract

Keep three sizing concepts separate:

- `masterWidth: hug`: the source component hugs its content.
- `masterWidth: <number>`: the source component uses a reviewable sample width.
- `placementWidth: fill`: page instances fill their containing Auto Layout.
- `placementWidth: fixed`: page instances retain their standard fixed size.

Never replace `hug` or `fill` with an arbitrary fixed width merely to make the
library page look tidy. A component may have a fixed review width while its
registered placement rule remains `fill`.

## Typography contract

Every reusable text layer must bind a shared Pixso Text Style. Matching only
font size, line-height, or layer height is not sufficient. Use the `textRoles`
map in `pixso-component-specs.json` and verify the style binding by reading the
node back from Pixso.

## Alpha contract

Core colors carry their final alpha. The receiving layer remains at 100%
opacity. Do not multiply a translucent color variable by another layer or paint
opacity.

The only normal exception is whole-component Disabled treatment, which may bind
the approved disabled opacity token. Colors such as `brand/10`,
`function/success/20`, and `neutral-dark/60` must not receive a second opacity.

## Icon contract

Resolve component icons through `assets/icons/icon-aliases.json`.

- Common controls use exact Lucide package geometry.
- Primary-level icons use the approved pinned Lucide Regular aliases.
- Titlebar controls use the exact titlebar SVG assets.
- Status icons use their approved circle assets.

Do not substitute a similarly named icon-font glyph for an approved SVG.

Run `node scripts/validate-pixso-icon-map.mjs` before releasing a Pixso component change. For generated Text to UI components, reject `HM Symbol` and `icon_font` layers unless the component is explicitly marked as an untouched native source reference.

For the primary-level/settings repair, use the exact
primary-level/settings alias from assets/icons/icon-aliases.json
(`lucide/settings`), replace the component-library slot in NewComponents, and
verify the 24 × 24 viewBox, root/vector geometry, visible overflow, and
currentColor binding on a temporary linked instance. Regenerate the HTML sprite
from the same alias and run the strict icon audit. Do not fix only the page
instance; the shared component slot and the source alias must agree.

## Safe synchronization sequence

1. Confirm the active Pixso file is “鸿蒙客户端设计规范”.
2. Pass the Token Gate and read variables, styles, and components.
3. Read `pixso-component-migration.json` and confirm the resource origin,
   migration status, active provider, and deletion permission.
4. Build a temporary replacement component away from the production library.
5. Apply Auto Layout, exact sizing behavior, bindings, text styles, and SVGs.
6. Read the new component back and run layout checking.
7. Compare it with the gallery at the same width and surface.
8. Only after it passes, switch the registry's active provider and migrate all
   linked instances.
9. Mark only the replaced `text-to-ui-generated` component as `superseded`.
   Add its exact name to the deletion allowlist only after its live instance
   count is zero. Never add or delete a `harmonyos-native` resource.
10. Resolve component GUIDs again immediately before an allowed deletion; never carry old GUIDs across a rebuild or an
active-document change.

### Plugin artifact delivery

The canonical plugin source remains under
`text-to-ui/scripts/pixso-component-registry-sync-plugin/`. Every Pixso plugin
release must also be copied to the user's fixed delivery directory:
`/Users/zhaobohai/Desktop/资源管理/我的代码仓/pixso插件/`. Keep each plugin in
its own named subfolder containing its `manifest.json`, entry script, and a
short installation note. Do not make a temporary workspace path the only
upload location.

### Coremail registration helper

For the Coremail validation path, load
`scripts/pixso-component-registry-sync-plugin/manifest.json` as a Pixso
development plugin after the source component names and Variant axes have been
normalized. The current manifest is `Text-to-UI Component Registry Sync v4 Safe`;
install it as a new local plugin so Pixso cannot reuse the old cached plugin
ID. Run **自检 Pixso 连接（只读）** first. Coremail 审计由 Codex MCP
实时读取，不再由插件执行长时扫描；MCP resolves the five
Coremail-priority logical components by exact component-set name and Variant,
then reports missing components, unexposed text slots, and `icon_font` layers.

The helper targets Pixso API 2.x. Pixso API 2 deprecates the synchronous
`findAll`/`findOne` node methods, so the helper must use `findAllAsync` and
scope library reads to the `NewComponents` page. Semantic SVG helper components
are created only on `NewComponents`; the older
`Text-to-UI Registered Icons` page is not the authoritative library page, and
the helper never moves nodes across pages. If the helper source changes, remove
the old local plugin and upload the new v4 Safe manifest before running a
command; otherwise Pixso may execute a cached copy.
A command failure must show the original error message and stop before any page
outside `NewComponents` is written. The plugin's audit menu is intentionally a
no-op safety notice; it does not scan Coremail or hold a Pixso login session
open.

The helper's audit command is read-only and must not call `pixso.commitUndo()`.
Only a command that reports an actual write may create an Undo checkpoint; this
avoids touching Pixso's undo state during a stale-document health check.

Run **补齐 NewComponents 文字槽位** only after reviewing the audit. It may
expose existing text as a component Text property, but it does not promote a
component to `verified`. v4 Safe deliberately does not run icon creation or
component swapping from the plugin: those writes previously caused Pixso to
resolve stale `S_Guid` values. Re-run the audit and create a
temporary linked instance to prove content overrides before changing an
adapter-map entry to `verified`.

For an imported page, first use `apply_design` with `$token` values for
`fillPaints`/`strokePaints`, then read the nodes back with `query_nodes`.
This binds ordinary TextNode fills as well as frame paints. For mixed ranges
or range-specific overrides, run **绑定 Coremail 文本颜色**; it uses Pixso's
SolidPaint range API. If any text remains blocked or unmapped after read-back,
keep strict parity disabled and record the exact node in the live audit.

If the active document changes, variables/styles disappear, or previously read
GUIDs become invalid, stop all writes immediately and re-run `fetch_context`.

## Component gate

A component is eligible for `pixso-component-registry.json` only when:

- its exact name is unique;
- it uses Auto Layout for normal content flow;
- direct children do not unintentionally overlap;
- Hug, Fill, and Fixed behavior matches the generated spec;
- every reusable text layer has the required Text Style;
- standard colors, sizes, radius, padding, and gaps are variable-bound;
- translucent tokens are not combined with extra opacity;
- icons have approved semantic aliases and exact source geometry;
- Pixso layout checking reports no issue;
- its screenshot matches the component gallery at the same dimensions.
- its provenance and takeover state pass the migration validator;
- a native candidate cannot replace the active generated provider until all
  gates pass.

Missing or failed components remain library defects. Page generation must not
redraw or detach an imitation.
