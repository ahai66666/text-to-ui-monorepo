import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Tooltip({ label = "刷新列表", description = "快捷提示", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "快捷提示";
  return (
    <div className="tui-generated tui-generated--floating" data-component="tooltip" data-logical-component="Tooltip/Default" data-variant="default" data-state="default" data-framework="react"><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">刷新列表</button><div className="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">刷新列表</span><span data-typography-role="body-m">快捷提示</span></div></div>
  );
}

export default Tooltip;
