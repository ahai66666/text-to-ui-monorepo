import React, { useState } from "react";
import { Icon } from "../shared.jsx";
import "../styles.css";

export function Accordion({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "基础信息、成员与通知方式";
  return (
    <div className="tui-generated tui-generated--disclosure" data-component="accordion" data-logical-component="Accordion/Default" data-variant="default" data-state="default" data-framework="react" {...props}>
      <button className="tui-generated__disclosure" type="button" aria-expanded={open} aria-controls="accordion-content" onClick={() => setOpen(!open)} data-typography-role="body-l">
        <Icon name="navigation/chevron-right" size={20} />
        <span data-slot="label" data-typography-role="body-l">项目设置</span>
      </button>
      <div className="tui-generated__disclosure-content" id="accordion-content" data-slot="content" hidden={!open} data-typography-role="body-l">{content}</div>
    </div>
  );
}

export default Accordion;
