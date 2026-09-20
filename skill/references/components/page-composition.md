# Page composition contract

HTML, React, and Vue page generation use the same `composition.regions` tree to
preserve model-authored information architecture without allowing component
internals to be redrawn.

Each Pattern region contains a tree of:

- `group`: a page-owned semantic wrapper. Allowed tags are `div`, `section`,
  `header`, `nav`, `article`, `aside`, and `footer`. It may declare `id`,
  `className`, `ariaLabel`, and nested `children`.
- `component`: a reference to one `componentBindings[].id`. The generator emits
  the registered framework renderer call; raw component markup is forbidden.
- `text`: static page content with an allowed semantic text tag. Text is escaped.

Every registered binding must appear exactly once in the composition tree. The
binding may still declare `expectedRuntimeCount` when one semantic collection
renders repeated registered instances. Composition wrappers may arrange and
size component hosts, but page CSS must not override protected component
internals.

This is a hard source rule: if a requested control or surface exists in the
canonical registry for the target framework, the composition must reference
that binding and let the adapter render it. A page-owned wrapper is not a
replacement component. A page composite is valid only for the capability that
the registry does not provide, and its custom source must keep using
`renderComponent` for every registered control and icon.

The Pattern renderer also owns the direct region geometry. A composition group
inherits the region's scroll-body inset and content axis; it is not a second
pane shell. If a group needs a card envelope, the group must distinguish its
own surface from the inherited pane inset and keep its content axis stable in
default, selected, empty, and error states.

## Content recipes: decide before binding

`page-content-recipes.json` makes each Blueprint content group choose its
implementation source before code generation:

- `registered-composition` names the exact registered binding IDs used by the
  group. Use it whenever those components provide the requested capability.
- `page-composite` is allowed only for a specialized business surface absent
  from the component library. It records fields, states, registry queries,
  rejected candidates, Token roles, and whether it remains page-owned or is a
  candidate for library promotion.

A page composite may arrange registered components; it must not redraw a
registered component just because its default visual shape is inconvenient.
Repeated business rows require their data entity, distinct local records, and a
shared selection key when they drive another Pattern region. The recipe maps to
one composition group, so generic components cannot be silently substituted
for a missing business-row design after generation begins.

## Style and behavior plans

### Executable HTML business composites

The model may write normal business markup, data and event logic inside a
declared page-composite host. Use `page-bindings.json.pageModules`:

```json
{"pageModules":[{"compositionId":"message-list","source":"./src/message-list.js"}]}
```

The source path is relative to the binding file. The group must be covered by a
page-composite recipe. Export `mount(host, { renderComponent })`; return a
cleanup function for listeners/subscriptions. The generated entry mounts it
after rendering the Pattern and imports the declared page CSS itself.

Use the supplied `renderComponent` for every button, field, attachment,
and other functional controls. Custom business rows may arrange semantic HTML
and registered controls. Put click and keyboard behavior in this module and
share business state through a normal imported store. Escape user/data text.
Only change descendants of `host`; do not query or replace Pattern regions,
insert navigation/toolbars into the shell, or import another shell stylesheet.
The scaffold owns main.js; do not patch generated files or bundle output.

Do not author native `button`, `input`, `select`, `textarea`, `svg`, or Pattern
data attributes in a page module. Do not query `document`; query only the
provided `host`. `validate-page-composite-boundaries.mjs` enforces this before
generation and before Fast Preview.

Design one representative row/card before repeating it: choose reading order,
primary and secondary fields, truncation, spacing using existing Tokens, and
default/selected states at the actual pane width. This is a design decision,
not a new mandatory report. A declared recipe alone does not implement it.

This module API currently supports HTML. React/Vue continue using their shared
composition tree; do not claim these HTML callbacks work in those frameworks.

Every page binding file includes two pre-generation plans:

- `stylePlan.schemaVersion: 1` with one record for every `group` node. Each
  record declares the owning region, at least one canonical Token role, and
  `componentBoundary: "preserve"`; if the group has a class name, the record
  declares the identical class name. The plan is the allowed page-owned styling
  scope, not a post-generation CSS audit. The actual page CSS must reference
  canonical CSS variables from `packages/tokens/src` (or the installed Token
  package) for colors, typography, spacing, radii, shadows, and dimensions.
  `tokenRoles` records intent; it never authorizes a literal value. Local CSS
  aliases must resolve to canonical variables, and the generator rejects raw
  color literals, raw px/rem/em/pt metrics, unknown Token names, and fallback
  literals such as `var(--color-text, #fff)` before writing output. Only
  `layout-contract.json.cssStructuralParameters` can document an intentional
  structural exception.
- `behaviorPlan.schemaVersion: 1` with declared interactions. Every interaction
  has an id, a supported kind (`component-native`, `toggle-hidden`,
  `set-selected`, `filter-collection`, `open-overlay`, or `close-overlay`) and
  trigger binding IDs. A binding that uses `behaviorId` must be one of that
  interaction's triggers.

The generator embeds both plans in every framework module and emits behavior
hosts for bound components. The generated HTML entry dispatches a
`text-to-ui:behavior` event to the page controller, so page-owned behavior is
connected through the declared plan rather than invented ad hoc in page code.

## Pattern-owned navigation shells

When a Pattern Context Packet selects `patternMode.navigation: "two-level"`,
the model must not author `composition.regions.primary-navigation`. Instead it
must provide `patternShell.navigation` with `mode: "two-level"` and these
slot-owned trees:

- `global-title-layer` and `global-primary-action`: top area;
- `secondary-navigation-content`: the middle, independently scrollable second
  level navigation;
- `primary-navigation-bottom`: icon-only first-level navigation, pinned to the
  bottom edge.

The renderer owns slot order and layout. A `primary-navigation-shell` binding
must use `primary-navigation-bottom`; a `secondary-navigation` binding must
use `secondary-navigation-content`. The generator rejects any other placement
before it writes a page artifact.

`global-primary-action` owns the primary action's only horizontal inset. Its
`navigation-top` wrapper is structural and carries no additional padding, even
though it retains legacy `data-pattern-shell-slot` metadata. Do not wrap the
action in a second padded container; a full-width primary action must have the
same width in the Pattern Runtime Renderer and in generated page output.

Static `pattern-shell.css` is retained only for legacy static Pattern markup.
It is scoped below a non-Runtime Pattern root and must not style a
`.tui-pattern-runtime` subtree. Runtime panes, slots, and scroll bodies own
their `border-box` model explicitly, so generated pages cannot depend on a
host application's global CSS reset for their geometry.

Business-page `Sidebar Item/Default` bindings must also provide explicit
`options.items` or `options.groups`. The HTML adapter's labels/counts are
gallery-only specimen defaults; they are intentionally rejected for a page so
demo data cannot leak into product navigation.

For Pattern B the renderer also owns the 64px title segments and pane scroll
bodies. It places `secondary-list-search` in the secondary title segment and
`main-detail-titlebar` / `main-detail-actions` in the detail title segment.
Business groups render inside the scroll bodies with the Pattern's insets.
Do not add a second toolbar, search header, pane padding, or nested pane scroll
to compensate for the shell. Compose content at the supplied 360px list width.
