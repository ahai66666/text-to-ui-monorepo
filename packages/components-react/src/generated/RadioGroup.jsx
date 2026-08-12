import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function RadioGroup({ label = "通知方式", description = "邮件 / 站内消息", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "邮件 / 站内消息";
  return (
    <label className="tui-generated tui-generated--choice" data-component="radio-group" data-logical-component="Radio Group/Default" data-variant="default" data-state="default" data-framework="react"><input type="radio"  defaultChecked /><span data-slot="label" data-typography-role="body-l">通知方式</span><span data-slot="description" data-typography-role="body-m">邮件 / 站内消息</span></label>
  );
}

export default RadioGroup;
