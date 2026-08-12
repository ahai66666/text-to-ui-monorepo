import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Label({ label = "项目名称", description = "必填", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "必填";
  return (
    <section className="tui-generated tui-generated--card" data-component="label" data-logical-component="Label/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">项目名称</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">必填</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="caption-l">辅助说明</small></span></section>
  );
}

export default Label;
