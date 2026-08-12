import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Checkbox({ label = "同步到云端", description = "已选中", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "已选中";
  return (
    <label className="tui-generated tui-generated--choice" data-component="checkbox" data-logical-component="Checkbox/Default" data-variant="default" data-state="default" data-framework="react"><input type="checkbox"  defaultChecked /><span data-slot="label" data-typography-role="body-l">同步到云端</span><span data-slot="description" data-typography-role="body-m">已选中</span></label>
  );
}

export default Checkbox;
