import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function NativeSelect({ label = "视图", description = "列表视图", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "列表视图";
  return (
    <div className="tui-generated tui-generated--menu" data-component="native-select" data-logical-component="Native Select/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-m"><span data-typography-role="body-m">视图</span></span><button className="tui-generated__control" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><span data-slot="leading"><Icon name="navigation/chevron-down" /></span><span data-slot="value" data-typography-role="body-m">列表视图</span><Icon name="navigation/chevron-down" /></button><div className="tui-generated__menu" role="menu" data-slot="content" hidden={!open}><button type="button" role="menuitem" data-typography-role="body-l">列表视图</button><button type="button" role="menuitem" data-typography-role="body-l">全部项目</button><button type="button" role="menuitem" data-typography-role="body-l">最近访问</button></div><span data-slot="help" data-typography-role="caption-l"><small data-typography-role="caption-l">选择一个选项</small></span></div>
  );
}

export default NativeSelect;
