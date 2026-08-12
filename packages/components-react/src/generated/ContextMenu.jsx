import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function ContextMenu({ label = "更多操作", description = "复制、重命名、删除", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "复制、重命名、删除";
  return (
    <div className="tui-generated tui-generated--menu" data-component="context-menu" data-logical-component="Context Menu/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">更多操作</span></span><button className="tui-generated__control" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><span data-slot="value" data-typography-role="body-m">复制、重命名、删除</span><Icon name="navigation/chevron-down" /></button><div className="tui-generated__menu" role="menu" data-slot="content" hidden={!open}><button type="button" role="menuitem" data-typography-role="body-l">复制、重命名、删除</button><button type="button" role="menuitem" data-typography-role="body-l">全部项目</button><button type="button" role="menuitem" data-typography-role="body-l">最近访问</button></div></div>
  );
}

export default ContextMenu;
