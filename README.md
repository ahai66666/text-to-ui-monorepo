# text-to-ui Monorepo

`text-to-ui` 是一个面向 HarmonyOS PC 客户端的设计到代码工作台：Skill 负责需求分析、页面结构、Token/组件搜索、Pixso 流程和验证；组件包负责提供真实的 HTML、React、Vue 实现；Pixso 映射包负责把逻辑组件解析为当前 `NewComponents` 中的原生实例和变量。

## 架构

```text
需求 → page-spec.json → 逻辑组件注册表
                         ├── HTML renderer
                         ├── React renderer
                         ├── Vue renderer
                         └── Pixso NewComponents resolver
```

同一个逻辑组件共享 Variant、状态、Slots、Token 和交互契约。框架实现分别维护，不能把 HTML 视觉相似物冒充 React/Vue 源组件，也不能把 Pixso 普通图层冒充原生实例。

## 完整代码仓交付边界（推荐）

本仓库按“规范源、Skill 交付镜像、生产组件包”三层交付。上传或克隆时应保留整个仓库；只复制 `skill/` 或只安装 Skill，都不会自动携带生产组件库，也不会让 Codex 自动注册这个 Skill。

```text
text-to-ui/                 # Skill 规范源，只在这里修改 Skill 规则
skill/                      # Skill 交付镜像，用于独立安装/发布
packages/                   # 生产组件包、Token、契约和 Pixso 映射
apps/component-gallery/     # 唯一正式组件画廊
tools/                      # 仓库级生成器与校验器
fixtures/                   # 最小契约测试输入说明
docs/                       # 架构、接入和发布文档
pnpm-workspace.yaml         # workspace 边界
pnpm-lock.yaml              # 根仓依赖锁定
README.md                   # 仓库入口和安装说明
```

使用完整仓库时，从仓库根目录执行：

```bash
pnpm install
pnpm delivery:validate
pnpm test
```

`delivery:validate` 会检查目录边界、根 workspace、组件注册表、HTML/React/Vue 三套源码入口、正式画廊，以及 `text-to-ui/` → `skill/` 的关键镜像文件是否同步。通过后，Skill 才能在同一份代码仓中读取生产组件契约和适配器。

### Skill 安装与组件库复用

- `text-to-ui/` 是唯一规范源；修改 Skill 规则时先改它，再同步到 `skill/`。
- `skill/` 是可独立安装的规则包，包含 Skill 入口、参考文档、Token/图标工具和预览资源；它不是生产组件包。
- `packages/` 才是 HTML、React、Vue 真实组件、共享样式、Token、契约和 Pixso 映射的来源。需要复用原生组件时，必须让这些目录与 Skill 一起存在，或按发布文档分别安装组件包。
- 从仓库克隆到本地不会自动把 Skill 注册到 Codex。需要在 Codex 的 Skills 目录安装 `skill/`（或 Release 中的 Skill 包），并在使用组件库时从本仓库根目录运行/提供组件包路径。

独立 Skill 安装与完整仓库开发是两个不同场景：前者能调用 `text-to-ui` 的规则，但如果没有 `packages/`，Skill 必须报告组件包不可用，不能用视觉相似物静默替代。

## 当前覆盖

| 组件 | HTML | React | Vue | Pixso 映射 |
| --- | --- | --- | --- | --- |
| 50 个登记组件（HTML / React / Vue 均有独立源码入口） | partial* | partial* | partial* | logical mapping |

`*` 当前 50 个组件已从通用生成适配器切换为独立的 HTML、React、Vue 源码入口，但全量一致性修复会先把所有组件保持为 `Partial`；只有 `sourceReady`、`contractReady`、`visualParity`、`behaviorParity`、`accessibilityParity`、`tokenParity` 六项均有可复跑证据后才恢复 `Ready`。当前质量门显示 `0 verified / 50 partial`，不能被 Skill 或 Pixso 严格通道宣称为已完成复用。全部组件都使用 canonical CSS Variables，并直接继承旧 Skill 的 HarmonyOS PC 组件规则。预览入口只有一份契约视觉基线：旧 Skill 的完整视觉画廊直接作为唯一视觉来源；运行时入口在同一个一级目录中用 HTML / React / Vue Tab 切换真实适配器，不再跳转二级运行时页面。严格 Pixso 通道仍需要在当前文件的 `NewComponents` 页面实时解析 Component Key/Variant，并读回 `$variable`。

旧三框架运行时对照是迁移期间的回归区；覆盖矩阵按六维判定展示真实 Ready/Partial 数量，新画廊直接加载组件包实现。完整视觉原稿在“契约组件 · 看样子”中统一展示；工程回归区只保留覆盖矩阵和维护入口，不再重复渲染第二套契约样例。原生组件预览严格跟随契约视觉章节和组件顺序，而业务 `category/order` 只负责代码组织；因此 HTML、React、Vue 都能在相同位置与契约基线逐项对比。运行时只显示结构性 Variant，状态通过真实交互查看。

组件实现的来源顺序是：既有 Skill/产品组件 → 组件契约适配器 → （确实缺失时）shadcn 结构起点。契约中的 `sourceStrategy` 会记录这次选择：`canonical-custom`、`shadcn-behavior-canonical-style` 或 `canonical-static`。引入 shadcn 时只复用结构和交互骨架，颜色、字号、间距、圆角、状态和图标必须重新映射到 canonical Token；不能把 shadcn 默认主题当成本项目样式。

## 目录

```text
skill/                    # Codex Skill，可独立安装
packages/tokens/          # Token CSS/JSON
packages/component-contracts/  # 跨框架组件契约
packages/component-styles/    # HTML/React/Vue 共享的 canonical CSS 入口
packages/components-html/ # 静态 HTML 组件
packages/components-react/# React 组件
packages/components-vue/  # Vue 组件
packages/pixso-mapping/    # Pixso 逻辑映射，不缓存 GUID
apps/component-gallery/    # HTML 组件画廊与覆盖矩阵
fixtures/                 # 最小测试输入
tools/                    # 仓库级校验
docs/                     # 架构、接入和发布文档
```

组件源码补齐与后续视觉精化规则见 [`docs/component-migration-plan.md`](docs/component-migration-plan.md)。

## 版本与发布

组件包和 Skill 独立版本：`skill-v1.4.0`、`components-v0.1.0`、`tokens-v0.1.0`。GitHub Release 发布 Skill ZIP 与组件包构建产物；需要工程依赖时再发布 React/Vue npm 包。仓库不保存运行时 Pixso GUID，GUID 在目标文件当前页面中重新解析。

## 本地验证

```bash
pnpm install
pnpm delivery:validate
pnpm contracts:validate
pnpm frameworks:validate
pnpm tokens:validate
pnpm styles:validate
pnpm pixso:mapping:test
pnpm runtime:evidence
pnpm runtime:http          # Vite 已启动时，验证三个真实入口
pnpm gallery:baseline:validate
pnpm skill:preview:check
```

组件画廊可直接打开 `apps/component-gallery/index.html`；运行 `pnpm gallery:sync-legacy` 会把旧 Skill 完整视觉基线同步到画廊的稳定本地资源，再访问 `http://127.0.0.1:4175/apps/component-gallery/index.html`。开发服务器推荐使用 Vite，以确保契约视觉基线不会被路径 fallback 替换。`file://` 仅用于 HTML 静态 fallback，React/Vue 入口会明确禁用；要切换真实三框架，请使用 HTTP。

Skill 默认流程为：需求分析 → 方案确认 → HTML 初稿 → 浏览器检查 → Pixso 细化 → 人工确认 → 最终 Demo。Pixso 导入分为视觉快速通道和 Token/组件精化通道；严格通道必须同时通过真实组件实例和变量读回。
