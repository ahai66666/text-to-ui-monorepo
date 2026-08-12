import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Kbd({ label = "快捷键", description = "⌘ K", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "⌘ K";
  return (
    <span className="tui-generated tui-generated--inline" data-component="kbd" data-logical-component="Kbd/Default" data-variant="default" data-state="default" data-framework="react" data-slot="label">⌘ K</span>
  );
}

export default Kbd;
