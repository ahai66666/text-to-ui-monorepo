import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Badge({ label = "进行中", description = "状态", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "状态";
  return (
    <span className="tui-generated tui-generated--inline" data-component="badge" data-logical-component="Badge/Default" data-variant="default" data-state="default" data-framework="react" data-slot="label">状态</span>
  );
}

export default Badge;
