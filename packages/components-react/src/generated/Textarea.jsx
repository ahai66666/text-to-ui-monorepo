import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Textarea({ label = "项目说明", description = "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。";
  return (
    <label className="tui-generated tui-generated--field" data-component="textarea" data-logical-component="Textarea/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span className="tui-generated__label" data-typography-role="body-m">项目说明</span></span><span className="tui-generated__control"><span data-slot="leading"><Icon name="field/search" /></span><textarea data-slot="value" data-typography-role="body-l" rows="3" defaultValue="统一 HarmonyOS PC 客户端中的布局、组件与交互规则。" /><span data-slot="trailing" data-typography-role="body-m"><Icon name="navigation/chevron-down" /></span></span><span data-slot="help" data-typography-role="caption-l"><small data-typography-role="caption-l">统一 HarmonyOS PC 客户端中的布局、组件与交互规则。</small></span></label>
  );
}

export default Textarea;
