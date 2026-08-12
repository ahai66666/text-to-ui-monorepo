# 组件包架构

## 单一逻辑身份

组件通过 `logicalName` 唯一识别，例如 `Button/Primary/Default`。每个实现必须输出相同的 `data-component`、`data-logical-component`、`data-variant` 和 `data-state` 契约属性。

## 三个 Web 适配器

- HTML：语义 DOM + CSS Variables + 原生事件。
- React：JSX/props/state，使用同一套契约属性。
- Vue：SFC/props/reactivity，不能把 `data-v-*` 或 CSS Module hash 当作组件身份。

三种实现不是相互编译，而是同一契约的独立适配器。当前 50 个逻辑组件在 HTML、React、Vue 中都已有独立源码入口，且已移除通用生成适配器；但没有通过六维一致性检查的框架必须标记为 `partial`，不能进入完整覆盖矩阵。旧 Skill 的 HTML 画廊只能作为 `visualAuthority`，不能把一个 `LegacyCatalog` 包装器当成三框架实现。

## 实现来源策略

每条契约都声明 `sourceStrategy`，用来控制成本和视觉一致性：

- `canonical-custom`：优先复制旧 Skill 已验收的结构和规则，针对 HarmonyOS PC 交互重新写轻量组件。当前 50 类独立实现均采用这一策略或其专用变体。
- `shadcn-behavior-canonical-style`：只把 shadcn / shadcn-vue 当作键盘、焦点、弹层等行为的起点，再覆盖全部 canonical Token、字体、间距、状态和图标；不能直接展示 shadcn 默认外观。
- `canonical-static`：对不需要复杂框架行为的组件，使用可读的独立静态适配器；视觉值仍由旧 Skill 的 canonical Token 和规则提供。

React 初始化可以使用项目确认过的命令：

```bash
pnpm dlx shadcn@latest init --preset b1aIcEaeG --base aria --template vite
```

这个命令只初始化 React 工程，不能直接生成 Vue 组件；Vue 需要单独使用 shadcn-vue 的初始化流程。无论选哪种行为基线，都必须把实现接入 `@text-to-ui/component-styles` 和 `@text-to-ui/tokens`，并通过组件契约校验后才可登记。

## 视觉来源优先级

组件包不重新发明一套 CSS。旧 Skill 的 `text-to-ui/preview/component-gallery.css`、`text-to-ui/assets/design-system/` Token 和 `fixtures/framework-component-contract/shared/` 组件规则是现阶段的视觉基线；`packages/component-styles/src/index.css` 是三个框架的 canonical CSS 入口，`packages/component-contracts/src/components.css` 只保留向后兼容导入。这样 HTML、React、Vue 共享同一套尺寸、字体、状态层、Surface 和图标语义。

组件画廊把“契约视觉基线”和“运行时组件”分成两个入口，但视觉基线只有一份：旧 Skill 的全量画廊直接作为契约的唯一视觉来源，保留历史 56 个组件的完整 Pattern、状态、布局与 Token 说明；当前注册表和运行时目录收敛为 50 个组件。运行时入口在同一个一级目录中提供 HTML、React、Vue 三个 Tab；选择 Tab 只替换目录中的真实渲染器，不跳转二级页面。三种渲染器都读取 `components.json.registryPolicy.comparisonGroups` 的同一视觉章节和组件顺序，生成同一套卡片外壳，只展示结构性 Variant，Hover、Focus、Pressed、Selected 和点击反馈通过真实控件交互查看。组件自己的 `category/order` 继续服务代码组织，不再改变视觉对比位置。来源路径和六维验收结果移到工程回归区，避免日常预览被工程信息包围。这里的框架切换不是给同一份 HTML 换标签，也不是复制一套假数据：每张卡片都从 `frameworks.<framework>.source` 指向的真实源码加载，根节点声明 `data-framework`。三套实现共享 Token、样式和契约，但渲染、Props、事件与响应式状态由各自框架执行。

运行时目录不把状态矩阵铺成第二套样例。每个卡片只渲染组件的默认态；组件自身仍保留完整状态契约，浏览器里的原生 `:hover`、`:focus-visible`、`:active` 和事件逻辑负责展示状态变化。Input 的白色内容面/灰色输入面等 Surface 规则仍由同一套组件样式驱动。其余组件直接加载各自生成的 HTML、JSX 或 Vue SFC 适配器；卡片中的示例文案只是源码默认 Props 的 fixture，不得用来冒充另一框架的渲染结果。只有当注册表中的 HTML、React、Vue 源码和状态/交互校验都通过时，才可以标记为 `ready`。

运行时的每张卡片同时写入 `data-contract-id`、视觉对比用的 `data-category/data-order`、代码组织用的 `data-registry-category/data-registry-order` 和 `data-fixture-id`，因此 HTML、React、Vue 可以与契约视觉页逐项对照，而不用牺牲组件注册表的业务分类。直接打开 `file://` 时只运行带内联 SVG 的 HTML 静态 fallback，React/Vue Tab 会明确置灰并提示使用 HTTP；只有 HTTP/Vite 页面才加载真实的 React/Vue 模块并用于三框架验收。

旧 Skill 已构建的 React / Vue / HTML fixture 仍保留在回归资料中，只用于历史交互对照；面向用户的运行时入口是 `index.html#runtime-view` 内的同页 Tab。`framework-html.html`、`framework-react.html`、`framework-vue.html` 仍保留为开发者单框架调试入口，不作为日常目录导航，也不把旧 fixture 的类名或截图当成组件身份。旧 Skill 视觉文件会在画廊构建时同步到稳定的 `apps/component-gallery/public/legacy-skill/` 路径，并写入 `.baseline-manifest.json` 对每个预览/Token 文件做 SHA-256 校验；`pnpm gallery:baseline:validate` 会阻止源文件与交付副本悄悄漂移，避免开发服务器的 fallback 把旧页面误加载成新的画廊。

当组件覆盖矩阵中的所有目标组件都达到 `ready`，且画廊已经直接加载组件包的 HTML、React、Vue 三套实现后，旧运行时对照只保留在 `fixtures/` 作为回归测试，不再放在面向用户的组件画廊中。

如果未来某个组件没有既有实现，才允许以 shadcn 的 HTML/React/Vue 实现作为结构起点；必须先套用 canonical Token、状态矩阵和 HarmonyOS 图标规则，并通过视觉回归后才能登记为组件包实现。shadcn 不是当前组件包的视觉来源，也不能覆盖既有 Skill 规则。

## Pixso

Git 中保存逻辑组件名、Variant 轴、Slots 和 Token 变量角色；不把缓存 GUID 作为唯一来源。运行时先聚焦 `NewComponents`，按逻辑名重新解析当前 Variant，再插入 linked instance 并读回 `mainComponent` 和 `$variable`。
