import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Breadcrumb({ label = "工作空间 / 项目 / 设置", description = "当前页面", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "当前页面";
  return (
    <nav className="tui-generated tui-generated--breadcrumb" data-component="breadcrumb" data-logical-component="Breadcrumb/Default" data-variant="default" data-state="default" data-framework="react" aria-label="面包屑"><a href="#" data-typography-role="body-l">工作空间</a><span>/</span><a href="#" data-typography-role="body-l">项目</a><span>/</span><span data-typography-role="body-l">工作空间 / 项目 / 设置</span></nav>
  );
}

export default Breadcrumb;
