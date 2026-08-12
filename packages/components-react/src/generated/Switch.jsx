import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Switch({ label = "自动同步", description = "已开启", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "已开启";
  return (
    <label className="tui-generated tui-generated--choice" data-component="switch" data-logical-component="Switch/Default" data-variant="default" data-state="default" data-framework="react"><input type="checkbox"  defaultChecked /><span data-slot="label" data-typography-role="body-l">自动同步</span><span data-slot="description" data-typography-role="body-m">已开启</span></label>
  );
}

export default Switch;
