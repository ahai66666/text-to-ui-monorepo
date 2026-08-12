import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Separator({ label = "分割线", description = "内容分组", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "内容分组";
  return (
    <div className="tui-generated tui-generated--separator" data-component="separator" data-logical-component="Separator/Default" data-variant="default" data-state="default" data-framework="react" role="separator" aria-label="分割线"></div>
  );
}

export default Separator;
