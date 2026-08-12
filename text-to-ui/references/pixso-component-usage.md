# Pixso Component Usage

Use this reference whenever a visual-first task creates a page from the “鸿蒙客户端设计规范” Pixso library.

## Runtime Contract

1. Read `assets/design-system/pixso-component-registry.json`.
2. Read `assets/design-system/pixso-component-specs.json`.
3. Read Pixso’s current reusable components once.
4. Match components by exact registered name and resolve the current document GUID at runtime.
5. Create instances from the resolved component GUIDs. Never persist GUIDs in the Skill because rebuilding a component can change its GUID.
6. Apply the registered `placementWidth` rule (`fill`, `hug`, or `fixed`) to the instance. Do not copy the source component's review width blindly.
7. Change only instance-safe content and dimensions required by the page. Do not detach an instance or redraw its internal icon, label, fill, padding, gap, radius, or standard height.
8. If a registered component is missing, stop that component path and report the missing exact name. Do not silently create a visually similar local frame.

Component resolution uses two page phases:

1. **Library phase:** focus `NewComponents`, refresh `fetch_context`, and
   resolve the exact registered name, current variant GUID, main component,
   exposed slots, and containing page. Repairs are allowed only in this phase.
2. **Target-page phase:** switch to the product page (for example Coremail)
   and create linked instances from the freshly resolved source component.
   The final product page does not need to be NewComponents. Audit each
   instance's mainComponent and containing page after insertion.

If the active page does not match the phase being performed, record
`activePageMismatch` and stop only the unsafe operation. Never pass an
ambiguous or colliding node ID to `apply_design`. A same-file local component
is stable enough for this two-phase flow; a published Library ID or Component
Key is needed only when resolving across files or through a shared-library API.

## Instance Content Gate

- For every component with `textSlots`, prove on a temporary linked instance that
  the required label or placeholder can be changed without detaching or editing
  the main component.
- Record `instanceContentStatus: "verified"` in the page spec only after a live
  read returns the changed text on the instance.
- Record `instanceContentStatus: "blocked"` when the source component lacks an
  exposed text property or a safe override path. Do not treat direct writes to a
  resolved instance child as verification.
- A blocked text slot is a component-library defect. A Token-binding study may
  continue, but the Frame is not an approvable component-parity design and the
  default source label must not be presented as finished UI copy.
- Do not hide placeholder instances, place them off-canvas, or cover their
  labels merely to satisfy a component-instance audit.

## HarmonyOS Native Component Adapter

When the active Pixso file contains copied components from the HarmonyOS
Component Library, read
`assets/design-system/harmonyos-component-adapter-map.json` before repairing or
rebuilding a registered component.

- Treat copied component sets as structure and platform evidence, not as
  registry-ready assets.
- Resolve the copied source by exact component-set name and variant axes at
  runtime; never persist its Pixso GUID. If the native library uses a different
  label for the same behavior, record it in `sourceVariantAliases` with every
  axis/value pair (for example `Icon + Text · Medium · Normal · Enabled` →
  `Icon Text Button/Ghost/Default`); never match on a shortened display name
  alone.
- Keep the registered Text to UI target as a standalone component until the
  registry explicitly changes its component-set policy.
- Rebind every promoted target to the listed Text to UI variables and shared
  styles.
- Replace HM Symbol and icon-font layers with the semantic icon alias listed in
  the adapter map.
- Preserve declared desktop deltas. Phone Checkbox, Radio, and Switch geometry
  is reference evidence and must not silently override approved desktop sizes.
- Entries under `sourceOnly` remain unregistered dependencies or references.
  Do not instantiate them during Text to UI page generation.

### Full registry coverage table

Generate and read
`assets/design-system/harmonyos-component-mapping-table.json` before page
composition or component-library repair:

```bash
node scripts/build-harmonyos-component-mapping-table.mjs --check
```

The table must contain exactly one row for every registered target. Treat its
states as follows:

- `mapped-pending-verification`: a native source mapping exists, but the target
  still needs live Pixso verification.
- `mapped-needs-rebuild`: a useful native source exists, but the registered
  target must be rebuilt to fix Tokens, SVG icons, surface variants, sizing, or
  instance-safe content.
- `verified`: the registered target passed the live Token, icon, text-slot,
  Auto Layout, sizing, and linked-instance gates.
- `missing-target`: no approved mapping exists yet. Add a source mapping or
  build a new registered target later.

Partial registry coverage is allowed. A page may proceed with the subset it
uses, but strict component parity requires every component used by that page to
be `verified`. Never promote the whole registry, or an individual page, merely
because a native component with a similar name exists.

## Verification priority

Verify the library in small batches, in this order:

1. Actions: Button/Primary/Default, Button/Secondary/Default,
   Button/Ghost/Default, Icon Button/Ghost/Default, and Icon Text Button
   variants.
2. Forms: Input/White Surface/Default, Input/Gray Surface/Default,
   Search/White Surface/Default, and Search/Gray Surface/Default.
3. Navigation: Sidebar Item/Default, Sidebar Group Header/Collapsed, and
   Primary Level Icon/Default.
4. Data display: List Item/White Surface/Default,
   List Item/Gray Surface/Default, List Container/White Canvas, and
   List Container/Gray Canvas.

Do not mark the next batch verified until the previous batch passes the live
Token, SVG, text-slot, Auto Layout, and linked-instance checks.

When Coremail is the validation page, use
`scripts/pixso-component-registry-sync-plugin/manifest.json` to audit the
five priority logical components after names and Variant axes have been
normalized. The plugin audit is evidence for component discovery only; the
`verified` state still requires semantic SVG icons, exposed instance content,
Token/style bindings, Auto Layout, and a live linked-instance read-back.
For imported Coremail pages, first use `apply_design` to set each literal
`fillPaints`/`strokePaints` value to the exact `$token`, then re-read with
`query_nodes`; this works for ordinary TextNode fills and produced verified
coverage in Coremail. For mixed text ranges, also run **绑定 Coremail 文本颜色**.
The command uses Pixso's SolidPaint range API. Any visual match without a
successful read-back remains a literal-style finding, not parity.

## Composition Rules

- Registered components are primitives for page generation; Patterns remain layout rules and are assembled from component instances.
- Use Auto Layout on every page-level row, column, toolbar, field group, list, card region, and pane wrapper.
- Bind page-level spacing and layout values to the existing variables. Do not replace component-owned variables with page literals.
- Resolve every semantic icon through `assets/icons/icon-aliases.json`. Lucide geometry comes from the installed package; HarmonyOS and titlebar controls use their exact SVG assets.
- Preserve transparent Ghost components. The canvas or containing surface supplies preview contrast.
- Keep the component instance linked. When the source component changes, generated pages must receive the update.
- When creating an instance with `apply_design`, include `type:"instance"` and the real variant GUID in `ref`. Omitting the type can create a visually similar FRAME that is not linked. Audit `type`, `mainComponent`/`overrideKey`, and `propRefMap` after insertion; the instance name alone is not evidence.

## Required Preflight

- Run `node scripts/validate-pixso-component-registry.mjs`.
- Run `node scripts/validate-harmonyos-component-adapter-map.mjs` when copied
  HarmonyOS source components are present.
- Run `node scripts/build-harmonyos-component-mapping-table.mjs --check`; the
  generated table must cover the complete registry even when some rows remain
  `missing-target`.
- Token Gate passes.
- Active Pixso file is “鸿蒙客户端设计规范” or the approved target library is enabled.
- Registry names and Pixso reusable component names have a one-to-one match.
- There are no duplicate names or `#2` suffixes.
- Registered components use Auto Layout and contain no unintended overlapping direct children.
- `node scripts/build-pixso-component-specs.mjs --check` and
  `node scripts/validate-pixso-component-specs.mjs` pass.
- Text layers have shared Text Style bindings; matching numeric typography is
  not sufficient.
- Translucent color variables are used at 100% layer/paint opacity.
- A Pixso read-back may show the variable's own alpha beside its name. Rebind a
  representative node and inspect node-level opacity before treating that
  serialization as a second opacity operation.
- Existing registered components are instantiated before any custom page-only primitive is drawn.
- Every declared text slot has `instanceContentStatus: "verified"` before the
  design is called component-parity complete.

## Page Generation Order

1. Resolve shell and pane layout tokens.
2. Resolve all required registered component names.
3. Create the top-level frame and page Auto Layout.
4. Insert component instances.
5. Override approved text/content properties.
6. Add only page-specific content that is not a registered reusable component.
7. Run layout checking and screenshot QA.

## Missing Component Rule

A missing registered component is a library defect, not permission to improvise. Record the exact name, continue only with unaffected regions, and repair the library through the component-maintenance workflow before claiming reusable parity.
