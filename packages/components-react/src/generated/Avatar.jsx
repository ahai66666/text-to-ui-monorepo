import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Avatar({ label = "H", description = "HarmonyOS", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "HarmonyOS";
  return (
    <div className="tui-generated tui-generated--avatar" data-component="avatar" data-logical-component="Avatar/Default" data-variant="default" data-state="default" data-framework="react" data-slot="content">H</div>
  );
}

export default Avatar;
