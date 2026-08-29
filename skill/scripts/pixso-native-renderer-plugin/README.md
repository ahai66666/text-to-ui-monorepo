# Text-to-UI Pixso Native Renderer

这个插件消费 `pixso-operation-plan.json`，也消费由 HTML 组件契约生成的
`pixso-component-library-plan.json`。页面计划在目标页创建 Instance；组件库计划只在
`NewComponents` 创建带命名槽位、组件属性和 Token 来源证据的真实 Component。

页面按“布局与内容 → 图标填充”两阶段生成。第一阶段只创建业务组合、组件 Instance
和稳定 Icon Slot；第二阶段在 Slot 内替换占位节点。SVG 只在资源表保存一次，描边与
实心图标分别保持原有 Stroke/Fill 通道，因此换图标不会改变 Auto Layout。

图标显示契约固定为：24px 使用 1.5px 描边、20px 使用 1.25px 描边、16px 使用
1px 描边；Icon Slot 是独立热区，水平和垂直都使用 `CENTER`，并在图标填充后按实际
Vector bounds 重新计算 x/y。新建页面、组件库复用和组件实例换图标都执行同一规则，
读回阶段会直接报告描边或上下对齐不一致。

## 使用

1. 先运行 `generate-pixso-component-library-plan.mjs` 同步 HTML 组件库；首次建议先用
   `--logical-name "Search/White Surface/Default"` 做小批量，再同步完整 HTML 组件。
2. 再运行 `generate-pixso-scene.mjs` 和 `generate-pixso-operation-plan.mjs`。
2. 在 Pixso 开发者模式载入本目录的 `manifest.json`。
3. 选择组件库计划或页面 `pixso-operation-plan.json`，点击“生成当前计划”。

## 自动桥接（推荐）

在每个 Pixso 文件中只需启动一次插件，并让它保持在右侧栏。Text-to-UI 生成
Operation Plan 后执行：

```bash
# 在 Text-to-UI 仓库根目录执行
pnpm services:start
node ./pixso-plugin-bridge.mjs publish ./pixso-operation-plan.json
```

统一服务组使用 Preview Hub `43173`、内部组件预览 `43175` 和 Pixso 自动桥
`43982`。启动命令可重复执行，不会重复创建服务；发布命令在桥未运行时仍会自动
启动桥接作为兜底。插件每秒检查一次；收到新计划后会先
完整生成并读回，成功后再替换相同 canonical key 的旧画板，不需要再次选择文件
或点击“生成”。手动导入按钮保留作调试与离线兜底。

### 本地编排服务与版本握手

`43982` 现在是常驻的 Text-to-UI Pixso 编排服务，不只是一次性的文件中转：

- `GET /service-status` 查看当前发布、插件连接、Runtime/协议兼容性和任务状态；
- `GET /official-adapter` 查看官方 Pixso 资源预检、执行器路由和导入后验收计划；
- `GET /job` 查看当前任务的排队、执行、成功或失败结果；
- `POST /result` 只接受当前 revision 和当前 import run 的结果；
- 插件 UI 会把 Kernel `5.0.0`、协议 `4`、Operation Plan 版本和能力清单发给服务；Bridge 会隔离旧计划、排队等待重连，并在 `/claim` 前完成能力协商。
- 导入期间新草稿保持可见，便于及时暂停；完整读回成功后才原子替换旧正式画板。暂停或失败会清理草稿并保留旧正式画板，正常导入最终只留下一个托管画板。

服务可以持续接收新的 Operation Plan，因此远程或外部编排端只需要更新计划、映射和规则即可；
插件代码/API 发生变化时，仍必须重新加载或安装新的 Pixso 插件包，服务不会静默下载并执行任意远程 JavaScript。

排查命令：

```bash
node scripts/start-text-to-ui-services.mjs status
curl http://127.0.0.1:43982/service-status
curl http://127.0.0.1:43982/official-adapter
curl http://127.0.0.1:43982/job
```

首次安装后，先选择同目录的 `pixso-plugin-smoke-test-plan.json`。它只会在
当前页面新建一个 760×320 的能力测试 Frame，检查 Variable、Text Style、
Button、Selection Dropdown、Search 和 CheckBox，不会修改现有画板。

默认执行会在当前 Pixso 文件中解析真实 Variables、Text/Effect Styles 和
NewComponents 中的组件变体。导入后会读回 Frame、变量化 Paint、文本样式和
Instance；任何缺失资源或读回异常都会报错，不会把它标为成功。

重复点击“生成当前计划”会定位并复用同一份已完成输出，不会继续创建同名
Frame。只有点击“新建版本”并确认后，才会保留旧结果并生成新的版本。

正常整页导入强制使用本插件；插件未连接或版本不兼容时会停止并显示精确原因，
不会自动回退 MCP。MCP 仅用于显式 converter-diagnosis 或用户批准的低保真应急路径，
仍使用同一个共享 Pixso Plugin API 运行时并单独读回审计。

组件库计划会把 HTML contract 的 `props`、`slots`、`slotContracts`、Token roles 和
HTML 源文件写入 Component plugin data，并用 `#slot-name` 创建真实命名槽位。
组件映射关系维护在 `assets/design-system/mapping-registry.json`；插件运行时读取其
生成的 `pixso-native-component-map.json` 兼容投影，只使用其中 `availability: mapped`
的条目。
组件契约已经声明但 Pixso 组件库尚未具备的槽位属于库缺陷，页面生成应先同步组件库，
不能在页面里拼接一个看起来相似的组合。
