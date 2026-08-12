import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function HoverCard({ label = "组件说明", description = "查看组件的详细使用规则", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "查看组件的详细使用规则";
  return (
    <div className="tui-generated tui-generated--floating" data-component="hover-card" data-logical-component="Hover Card/Default" data-variant="default" data-state="default" data-framework="react"><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">组件说明</button><div className="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">组件说明</span><span data-typography-role="body-m">查看组件的详细使用规则</span></div></div>
  );
}

export default HoverCard;
