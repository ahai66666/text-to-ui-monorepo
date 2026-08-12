# HarmonyOS 源组件 → Text-to-UI 注册组件全量映射表

> 该表由 `scripts/build-harmonyos-component-mapping-table.mjs` 生成。映射成功只表示已找到源组件；只有 `verified` 才能进入严格交付。

- 注册组件：76
- 已映射待验证：16
- 已映射需重建：5
- 已验证：0
- 缺失待补：55

| 分类 | Text-to-UI 注册名 | 状态 | HarmonyOS 源组件 | 源 Variant | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 01 Actions | Button/Primary/Default | mapped-pending-verification | Button | size=Medium, state=Default, type=Primary | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Button/Secondary/Default | mapped-pending-verification | Button | size=Medium, state=Default, type=Secondary | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Button/Ghost/Default | mapped-pending-verification | Button | size=Medium, state=Default, type=Ghost | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Icon Text Button/Primary/Default | mapped-pending-verification | Icon Text Button | size=Medium, state=Default, type=Primary | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Icon Text Button/Secondary/Default | mapped-needs-rebuild | Icon Text Button | size=Medium, state=Default, type=Primary | Rebuild the registered target from the mapped native source, then pass Token, icon, text-slot, layout, and linked-instance gates. |
| 01 Actions | Icon Text Button/Ghost/Default | mapped-pending-verification | Icon Text Button | size=Medium, state=Default, type=Ghost; alias Icon + Text: 尺寸=Medium, 类型=Normal, 状态=Enabled | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Icon Button/Ghost/Default | mapped-pending-verification | Icon Button | size=Medium, state=Default, type=Ghost; alias Iconbutton: 尺寸=Medium, 类型=Normal, 状态=Enabled | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Icon Button/Secondary/Default | mapped-needs-rebuild | Icon Button | size=Medium, state=Default, type=Ghost | Rebuild the registered target from the mapped native source, then pass Token, icon, text-slot, layout, and linked-instance gates. |
| 01 Actions | Selection Dropdown/Default | mapped-pending-verification | Selection Dropdown | size=Medium, state=Default | Finish the registered target and verify it live in Pixso before strict delivery. |
| 01 Actions | Split Dropdown Button/Icon Text/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 01 Actions | Split Dropdown Button/Icon Only/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 01 Actions | Toggle/Off/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Field/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Field/With Description | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Input/White Surface/Default | mapped-pending-verification | TextInput | surface=white, state=Default | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Input/Gray Surface/Default | mapped-pending-verification | TextInput | surface=dark, state=Default | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Search/White Surface/Default | mapped-pending-verification | Search | surface=white, state=Default | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Search/Gray Surface/Default | mapped-needs-rebuild | Search | surface=dark, state=Default | Rebuild the registered target from the mapped native source, then pass Token, icon, text-slot, layout, and linked-instance gates. |
| 02 Forms | Textarea/White Surface/Default | mapped-pending-verification | TextInput-Muti-2in1 | 灰色场景=OFF, 状态=Normal | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Textarea/Gray Surface/Default | mapped-pending-verification | TextInput-Muti-2in1 | 灰色场景=ON, 状态=Normal | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Select/White Surface/Default | mapped-needs-rebuild | Selection Dropdown | size=Medium, state=Default | Rebuild the registered target from the mapped native source, then pass Token, icon, text-slot, layout, and linked-instance gates. |
| 02 Forms | Select/Gray Surface/Default | mapped-needs-rebuild | Selection Dropdown | size=Medium, state=Default | Rebuild the registered target from the mapped native source, then pass Token, icon, text-slot, layout, and linked-instance gates. |
| 02 Forms | Combobox/White Surface/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Combobox/Gray Surface/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Input OTP/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Checkbox/Unchecked/Default | mapped-pending-verification | CheckBox-2 in 1 | Selected=OFF, 状态=Enabled | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Radio/Unselected/Default | mapped-pending-verification | Radio-Phone | Selected=OFF, 状态=Enabled | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Switch/Off/Default | mapped-pending-verification | Switch-Phone | Selected=OFF, 状态=Enabled | Finish the registered target and verify it live in Pixso before strict delivery. |
| 02 Forms | Slider/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Date Picker/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 02 Forms | Time Picker/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Titlebar/S/Normal | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Titlebar/M/Normal | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Titlebar/L/Normal | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Titlebar/XL/Normal | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Sidebar Item/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Sidebar Group Header/Collapsed | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Primary Level Icon/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Tabs/Filled/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Tabs/Line/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Tabs/Vertical/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Breadcrumb/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Pagination Item/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Accordion/Collapsed | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 03 Navigation | Collapsible/Collapsed | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Card/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Card/Header Body Footer | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Metric Card/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | List Item/White Surface/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | List Item/Gray Surface/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | List Container/White Canvas | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | List Container/Gray Canvas | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Table/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Table Header/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Table Row/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Badge/Neutral | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Badge/Info | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Badge/Success | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Badge/Warning | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Avatar/32/Image | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Avatar/32/Fallback | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Avatar/40/Image | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Avatar/40/Fallback | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Progress/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Spinner/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Skeleton/Text | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Skeleton/Avatar | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Skeleton/List Row | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 04 Data Display | Skeleton/Card | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Alert/Info | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Alert/Success | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Alert/Error | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Alert/Warning | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Alert/Neutral | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |
| 05 Feedback | Snackbar/Default | mapped-pending-verification | Snackbar | 左侧区域=1 | Finish the registered target and verify it live in Pixso before strict delivery. |
| 05 Feedback | Tooltip/Default | missing-target |  |  | Add a source mapping or draw a new registered target, then verify it live in Pixso. |

## 仅作源参考

| HarmonyOS 源组件 | 原因 |
| --- | --- |
| Toggle-状态按钮-2in1 | Its segmented 72x28 behavior does not match the registered desktop Toggle/Off component. |
| Chips-2in1 | No registered static target in the current component scope. |
| ScrollBar-Phone | Platform utility, not a registered reusable component in the current scope. |
| Menu-2in1 | Expanded menus are Open-state overlays and are outside the current static component scope. |
| CheckboxGroup-Phone | Composite form group; current registry keeps Checkbox as the primitive. |
| .2in1 Container | Dialog dependency only. |
| .text | Dialog dependency only. |
| Dialog-2in1 | Dialogs are explicitly excluded from the current formal component registry. |
| ColorPicker-Tablet | No registered static target in the current component scope. |
| Search-Second Page-2in1 | Composite secondary-page pattern, not a primitive Search component. |

