# Component Coverage

Use this file when extending the bundled component system or auditing the preview gallery.

Last checked: 2026-08-07

Official source: [shadcn/ui Components](https://ui.shadcn.com/docs/components)

The official directory currently lists 64 component or guide entries. The bundled system keeps 51 upstream-style entries plus the project-specific Semi-modal composition. “Visual baseline covered” means the old Skill gallery includes a representative example or documented variant. “Framework ready” is stricter: independent HTML, React, and Vue sources, states, editable slots, Token usage, and visual QA must all pass. The current registry has all 56 project components at framework-ready source coverage; Pixso remains a logical mapping until the current `NewComponents` page supplies a live linked instance and variable readback.

## Visual Baseline — 52 Entries

```text
Accordion
Alert
Alert Dialog
Aspect Ratio
Attachment
Avatar
Badge
Breadcrumb
Bubble
Button
Calendar
Card
Carousel
Chart
Checkbox
Collapsible
Combobox
Context Menu
Data Table
Date Picker
Time Picker
Dialog
Dropdown Menu
Empty
Field
Hover Card
Input
Input OTP
Item
Kbd
Label
Menubar
Native Select
Navigation Menu
Pagination
Popover
Progress
Radio Group
Select
Separator
Sidebar
Skeleton
Slider
Spinner
Switch
Table
Tabs
Textarea
Toast
Toggle
Tooltip
Typography
```

## Project-specific Compositions

These compositions extend the upstream component set. They are not counted in the 51/51 upstream coverage number, but they do count toward the 52-component gallery total:

```text
Semi-modal
```

## Framework Ready — 56/56

```text
All entries in the registry (`packages/component-contracts/src/components.json`) now have an independent HTML, React, and Vue source path. The five original adapters retain their hand-authored implementations; the remaining 51 adapters are generated from the same canonical contract and styles so they can be refined component-by-component without falling back to the old gallery.
```

The old Skill gallery remains a regression source only. A component is not considered Pixso strict-ready until the runtime resolver finds its linked `NewComponents` instance and reads back its Variables.

Semi-modal must have visible S/M/L, White/Gray, and modal/non-modal preview variants before its rules are considered synchronized.

Alert Dialog remains the destructive Dialog variant rather than a second standalone container. It uses the fixed 400px Dialog surface, starts focus on the safe action, names the affected object, and does not dismiss on outside click.

## Coverage Gate

For future additions or upstream changes, keep these synchronized:

1. Semantic tokens and component rules.
2. A declared `sourceStrategy` (`canonical-custom`, `shadcn-behavior-canonical-style`, or `canonical-static`).
3. Independent HTML, React, and Vue source with the same logical contract.
4. shadcn and Pixso mapping where applicable.
5. Visible gallery example with realistic content.
6. Pointer, keyboard, focus, disabled, error, loading, and overlay behavior as applicable.
7. Visual QA at 1728×1152 and 1100×720.
