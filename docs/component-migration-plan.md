# 三框架组件迁移批次

当前组件包不把旧 Skill 的全量 HTML 画廊当作三框架组件。`packages/component-contracts/src/components.json` 是唯一覆盖状态来源：

- `ready`：HTML、React、Vue 都有真实源码，契约属性、状态、Slots、Token 和视觉检查全部通过。
- `partial`：源码或六维一致性尚未完成，不能作为跨框架或 Pixso 严格复用组件；当前 50 个组件处于此状态。三框架源码入口已经齐全，视觉、行为、可访问性和 Token 证据仍需逐批补齐。

## 已完成

| 批次 | 组件 | 来源策略 | 状态 |
| --- | --- | --- | --- |
| 0 | Button、Input、Search、Sidebar、List Card | `canonical-custom` | `partial`，等待浏览器证据 |
| 1 | Titlebar、Textarea、Field、Select、Combobox、Native Select | `canonical-custom` | `partial`，等待浏览器证据 |
| 2 | Checkbox、Radio Group、Switch、Tabs、Accordion、Collapsible | `canonical-custom` | `partial`，等待浏览器证据 |
| 3 | Avatar、Badge、Card、Item、Table、Data Table、Pagination、Breadcrumb | `canonical-custom` | `partial`，等待浏览器证据 |
| 4 | Dropdown、Popover、Tooltip、Dialog、Alert Dialog、Semi-modal、Context Menu | `canonical-custom` / `shadcn-behavior-canonical-style` | `partial`，等待浏览器证据 |
| 5 | Calendar、Date Picker、Time Picker、Loading、Feedback、Specialized 组件 | `canonical-custom` | `partial`，等待浏览器证据 |

## 后续精化（源码、行为和视觉同时补齐）

接下来按旧 Skill 视觉基线逐个细化真实三框架交互和视觉验收；只有六项全部通过才升级为 `ready`：

```text
├── Alert / Badge / Card / Empty / Avatar
├── Label / Textarea / Native Select / Field
├── Breadcrumb / Separator / Item
└── Table / Progress / Pagination
```

这些组件已经有三个框架的真实入口；优先从旧 Skill 的语义 DOM 和 CSS 规则校准细节。不需要为了“看起来像组件库”引入 shadcn；已有 shadcn 行为起点的组件也必须继续覆盖为 canonical Token。所有批次目前均保持 `partial`，直到浏览器级视觉和行为证据可复跑。

## 交互精化批次

```text
├── Accordion / Collapsible / Tabs
├── Checkbox / Radio Group / Switch / Slider
├── Select / Combobox / Dropdown Menu / Context Menu
├── Dialog / Alert Dialog / Popover / Hover Card
└── Calendar / Date Picker / Time Picker
```

这批可以按框架分别采用 shadcn 和 shadcn-vue 的行为基础，但只接受行为和无障碍结构。颜色、字号、间距、圆角、Surface、图标和状态层必须由 `@text-to-ui/tokens` 与 `@text-to-ui/component-styles` 提供。

## 产品组合组件

Titlebar、Semi-modal、Data Table、Chart、Attachment、Toast 以及 Primary Navigation / Three-Pane / Secondary Page 等模式最后迁移。它们依赖多个基础组件，必须在基础组件达到 `ready` 后再组合，不能用一个泛化容器提前占位。

## 每个组件的升级门槛

1. 契约包含逻辑名、Variant、状态、Props、Slots、Token 角色和 Pixso 逻辑映射。
2. HTML、React、Vue 各自有可读、可编辑的源码入口，不能使用 `v-html`、`dangerouslySetInnerHTML` 或 `LegacyCatalog` 作为生产实现。
3. 默认、hover、pressed、focus、disabled、selected/open 等适用状态可被测试触发。
4. 颜色和尺寸从 canonical Token 读取，不能在源码中写死可见颜色。
5. 画廊用真实适配器渲染并通过 1728×1152 浏览器检查。
6. Pixso 只登记逻辑映射；只有运行时解析到 NewComponents 的 linked instance 并读回 Variables 后，才可单独标记 Pixso strict verified。
