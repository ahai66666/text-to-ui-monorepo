import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Field({ label = "项目名称", description = "客户端设计系统", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "客户端设计系统";
  return (
    <label className="tui-generated tui-generated--field" data-component="field" data-logical-component="Field/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-m"><span className="tui-generated__label" data-typography-role="body-m">项目名称</span></span><span className="tui-generated__control"><span data-slot="leading"><Icon name="field/search" /></span><input data-slot="value" data-typography-role="body-l" type="text"  defaultValue="客户端设计系统" /><span data-slot="trailing" data-typography-role="body-m"><Icon name="navigation/chevron-down" /></span></span><span data-slot="help" data-typography-role="caption-l"><small data-typography-role="caption-l">客户端设计系统</small></span></label>
  );
}

export default Field;
