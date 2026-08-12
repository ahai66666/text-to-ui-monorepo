import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Titlebar({ label = "项目空间", description = "全局操作按钮", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "全局操作按钮";
  return (
    <header className="tui-generated tui-generated--titlebar" data-component="titlebar" data-logical-component="Titlebar/Default" data-variant="small" data-state="default" data-framework="react"><span data-slot="leading"><Icon name="navigation/grid" /></span><span data-slot="label" data-typography-role="title-s">项目空间</span><div data-slot="actions"><button className="tui-icon-button" aria-label="更多"><Icon name="action/more" /></button><button className="tui-icon-button" aria-label="关闭"><Icon name="action/close" /></button></div></header>
  );
}

export default Titlebar;
