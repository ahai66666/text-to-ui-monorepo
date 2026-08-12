import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Collapsible({ label = "更多信息", description = "点击展开详情", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "点击展开详情";
  return (
    <div className="tui-generated tui-generated--disclosure" data-component="collapsible" data-logical-component="Collapsible/Default" data-variant="default" data-state="default" data-framework="react" {...props}>
      <button className="tui-generated__disclosure" type="button" aria-expanded={open} aria-controls="collapsible-content" onClick={() => setOpen(!open)} data-typography-role="body-l">
        <span data-slot="label" data-typography-role="body-l">{label}</span>
        <Icon name="navigation/chevron-down" size={20} />
      </button>
      <div className="tui-generated__disclosure-content" id="collapsible-content" data-slot="content" hidden={!open} data-typography-role="body-l">{content}</div>
    </div>
  );
}

export default Collapsible;
