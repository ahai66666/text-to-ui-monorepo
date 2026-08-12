import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Empty({ label = "暂无项目", description = "创建一个项目开始工作", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "创建一个项目开始工作";
  return (
    <div className="tui-generated tui-generated--empty" data-component="empty" data-logical-component="Empty/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="navigation/grid" /><span data-slot="label" data-typography-role="title-s">暂无项目</span><span data-slot="description" data-typography-role="body-m">创建一个项目开始工作</span><button className="tui-button" type="button" data-variant="primary" data-typography-role="body-l">新建项目</button></div>
  );
}

export default Empty;
