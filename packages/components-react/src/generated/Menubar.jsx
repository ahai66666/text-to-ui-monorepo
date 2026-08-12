import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Menubar({ label = "文件  编辑  查看", description = "菜单栏", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "菜单栏";
  return (
    <div className="tui-generated tui-generated--menu" data-component="menubar" data-logical-component="Menubar/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">文件  编辑  查看</span></span><button className="tui-generated__control" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><span data-slot="value" data-typography-role="body-m">菜单栏</span><Icon name="navigation/chevron-down" /></button><div className="tui-generated__menu" role="menu" data-slot="content" hidden={!open}><button type="button" role="menuitem" data-typography-role="body-l">菜单栏</button><button type="button" role="menuitem" data-typography-role="body-l">全部项目</button><button type="button" role="menuitem" data-typography-role="body-l">最近访问</button></div></div>
  );
}

export default Menubar;
