import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Popover({ label = "筛选条件", description = "状态、负责人、更新时间", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "状态、负责人、更新时间";
  return (
    <div className="tui-generated tui-generated--floating" data-component="popover" data-logical-component="Popover/Default" data-variant="default" data-state="default" data-framework="react"><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">筛选条件</button><div className="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">筛选条件</span><span data-typography-role="body-m">状态、负责人、更新时间</span></div></div>
  );
}

export default Popover;
