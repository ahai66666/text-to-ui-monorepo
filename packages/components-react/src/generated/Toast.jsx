import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Toast({ label = "保存成功", description = "所有修改已经同步到云端。", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "所有修改已经同步到云端。";
  return (
    <div className="tui-generated tui-generated--feedback" data-component="toast" data-logical-component="Toast/Default" data-variant="default" data-state="default" data-framework="react" role="status"><Icon name="action/check" /><span data-slot="label" data-typography-role="subtitle-s">保存成功</span><span data-slot="content" data-typography-role="body-l"><span>所有修改已经同步到云端。</span></span><button className="tui-icon-button" type="button" aria-label="关闭"><Icon name="action/close" /></button></div>
  );
}

export default Toast;
