# Titlebar · 分段标题栏

Titlebar is a segment component, not a second Pattern shell. Pattern owns the
ordered title segments, their widths, dividers and height. Do not give Titlebar
a separate grid or hard-code a navigation width. Preserve the existing size
and visual variants. Existing `paneRole` calls remain compatible.

The Runtime shell itself is one column with two rows: the pane-aligned Global
Title Layer, then the Pattern pane grid. Pattern-specific column widths belong
to `.tui-pattern-runtime__pane-grid`, not the Runtime root. A page or adapter
that adds `grid-template-columns` to the root recreates the historical
four-column/overlap bug and is a blocking layout error.

## Scenarios

- Two panes: brand segment → content-title + window-control segment.
- Three panes: brand segment → empty alignment segment → detail-action +
  window-control segment. Empty is deliberate, not missing content.
- `Titlebar_S` (`size: "small"`, 40px) is standalone-only. It may be used as
  one complete titlebar (including a standalone final-pane title), but it must
  not be split into two-column or three-column Pattern segments. Use M/L/XL for
  pane-aligned title segments.
- `segmentRole` uses `primary-navigation`, `secondary-list`, `main-content`,
  or `main-detail`. `paneRole` legacy aliases still work.
- Other Pattern segment sequences may use `createTitlebarSegments` with the
  resolved `pattern.titleLayer.segments`; it returns configurations only and
  does not render a competing layout.

## Trailing inset

The rendered Titlebar keeps a 12px trailing inset. This applies to the S / 40px
standalone preview as well as the generic generated adapter, which use the
existing `--padding-titlebar-trailing-l` token. Do not replace it with a raw
`12px` value or the legacy `--padding-titlebar-trailing-s` token; the component
style is the shared source for HTML, React, and Vue.

## Executable slots (shared HTML / React / Vue API)

| Slot | Value | Segment |
| --- | --- | --- |
| `leading` | `{ src, alt? }` logo image | Brand |
| `label` | Text | Brand |
| `main-content-leading` | `{ id, label, icon, buttonType? }` action object | Two-pane final segment; leading action such as Back; 24×24 icon, 4px gap to title |
| `main-content-title` | Text | Standalone final title or two-pane final segment |
| `main-detail-actions` | Action objects array | Three-pane final segment |
| `actions` | Boolean; enable/disable built-in window controls | Final segment |

These are controlled content slots, not arbitrary HTML or containers. Titles
are escaped text, actions render through library buttons, and window controls
remain component-owned. Invalid slot/segment combinations fail before render.
`showWindowControls: false` also hides the built-in controls. Only a standalone
global Titlebar or a final segment may show them.

In a generated Pattern B HTML page, the compiler composes the primary,
secondary, and final values into one pane-aligned Global Title Layer. The
detail action group is then activated with `bindTitlebarOverflow`; do not leave
the detail Titlebar in a pane-local header or add a second hand-written action
row, because that produces an apparent fourth column and allows actions to
paint over the fixed window controls.

```js
import { createTitlebarSegments, renderHtmlComponent } from '@text-to-ui/components-html';
const segments = createTitlebarSegments(resolvedPattern, {
  'primary-navigation': { slots: { leading: { src: './logo.svg', alt: '产品' }, label: '项目空间' } },
  'main-detail': { slots: { 'main-detail-actions': [
    { id: 'reply', label: '回复', icon: 'action/reply', buttonType: 'icon-text-ghost' }
  ] } }
});
for (const { region, ...options } of segments) {
  // Pass the markup to the corresponding existing Pattern title segment.
  titleSegmentContent[region] = renderHtmlComponent('titlebar', options);
}
```

React: `<Titlebar layout="two-column" segmentRole="main-content"
slots={{ 'main-content-leading': { id: 'back', label: '返回', icon: 'navigation/back' }, 'main-content-title': '项目详情' }} onMainContentAction={handleBack} onAction={handleWindowAction} />`.
Vue accepts the same `:slots` object and emits `action` / `main-detail-action`.
HTML callers bind the existing `data-action` events; these are web-window
requests, not browser permission to close or minimize the native application.

For generated `page-bindings.json`, put values on the binding's `slots`, not
both `options.slots` and `slots`. The generator forwards this content to all
three framework implementations. Declare the semantic context for the segment
as usual; slots do not authorize moving the segment or using a handwritten
button. Preserve the main-detail action restrictions in source-resolution.md.
