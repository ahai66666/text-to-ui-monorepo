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

因此，独立安装 Skill 后只能确认“规则已安装”；只有组件包也可发现并通过契约校验时，才能声称使用了注册组件。仓库克隆不会自动完成 Codex Skill 注册，宿主环境仍需按 Skill 安装规则启用 `skill/`。

### 发布门禁

`pnpm delivery:validate` 会阻止以下情况进入发布流程：规范源和交付镜像的关键文件不一致、组件契约缺少任一 HTML/React/Vue 源入口、workspace 或正式画廊缺失、根 README 未声明完整仓库边界。

## 多人复用的上传边界

公开 Git 仓库应提交所有可复用、可审查和可重现的工程内容：Skill 规范源与镜像、HTML/React/Vue 组件、Tokens、组件契约、Pattern、Pixso 映射、组件画廊、示例应用、Fixtures、生成器、校验器、文档、锁文件和 CI 配置。确定性生成文件可以提交，但必须使用仓库相对路径，并在文件头或文档中标记生成来源。

以下内容不属于可复用工程，不应提交：`node_modules`、构建目录、缓存、`.text-to-ui/` 运行状态、登录/连接会话、机器绝对路径、临时截图、一次性测试输出、个人测试文档和任何密钥。需要展示的审计结论应整理为不含敏感信息的 Markdown；可重放的 Pixso Scene 或 Operation Plan 应先清理本机路径和易失字段，再作为示例输入提交。

任何贡献者都应能从干净克隆完成：

```bash
pnpm install
pnpm test
pnpm gallery:build
```

Coremail 的 Pixso MCP 备用计划可按需重生成：

```bash
pnpm pixso:scene:coremail
pnpm pixso:operation-plan:coremail
pnpm pixso:mcp-plan:coremail
```

MCP 计划会按模块裁剪 Token/Style 资源，并使用仓库内的压缩运行时；每个调用都经过 150 KB 上限校验。这样干净克隆后仍可复现计划，不依赖某台机器上的运行时路径。

组件、Skill 和示例应用通过分支与 Pull Request 合并，`main` 只接收通过 CI 和评审的变更。GitHub 源码公开、GitHub Release 和 npm 包发布是三个独立动作，不能用“代码已上传”替代版本发布。
