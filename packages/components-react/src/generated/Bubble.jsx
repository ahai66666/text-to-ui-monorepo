import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Bubble({ label = "Bubble", description = "HarmonyOS PC 组件示例", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "HarmonyOS PC 组件示例";
  return (
    <section className="tui-generated tui-generated--card" data-component="bubble" data-logical-component="Bubble/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">Bubble</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">HarmonyOS PC 组件示例</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-s">辅助说明</small></span></section>
  );
}

export default Bubble;
