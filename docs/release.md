# 发布约定

使用 pnpm workspace 管理包，使用 Changesets（接入后）分别发布：

- `skill-vX.Y.Z`：Codex Skill ZIP。
- `components-vX.Y.Z`：HTML/React/Vue 组件包。
- `tokens-vX.Y.Z`：Token 基础包。

Skill 记录兼容的组件包范围。Token 破坏变化会提升组件包 major；组件实现变化只提升组件包；Skill 规则变化只提升 Skill。GitHub 仓库提交源码、契约、测试、Token 和映射；不提交 `node_modules`、缓存、临时 ZIP 或失效 GUID 快照。

## 完整仓库与独立发布包

### 完整仓库（开发、协作和验收）

完整代码仓必须同时包含：

```text
text-to-ui/             # Skill 规范源
skill/                  # Skill 交付镜像
packages/               # 生产组件、Token、契约和 Pixso 映射
apps/component-gallery/ # 正式组件画廊
tools/                  # 生成与校验脚本
```

上传前从根目录执行：

```bash
pnpm install
pnpm delivery:validate
pnpm test
```

### 独立发布包

独立 `text-to-ui-skill` 包只保证 Skill 规则、索引、工具和预览资源可安装；它不携带 `packages/` 生产组件源码。`text-to-ui-components` 和 `text-to-ui-tokens` 需要作为兼容版本一起安装或作为 Monorepo workspace 依赖提供。

因此，独立安装 Skill 后只能确认“规则已安装”；只有组件包也可发现并通过契约校验时，才能声称使用了注册原生组件。仓库克隆不会自动完成 Codex Skill 注册，宿主环境仍需按 Skill 安装规则启用 `skill/`。

### 发布门禁

`pnpm delivery:validate` 会阻止以下情况进入发布流程：规范源和交付镜像的关键文件不一致、组件契约缺少任一 HTML/React/Vue 源入口、workspace 或正式画廊缺失、根 README 未声明完整仓库边界。
