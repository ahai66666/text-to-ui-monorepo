import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Alert({ label = "系统将在今晚自动完成更新。", description = "查看详情", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "查看详情";
  return (
    <div className="tui-generated tui-generated--feedback" data-component="alert" data-logical-component="Alert/Default" data-variant="info" data-state="default" data-framework="react" role="status"><Icon name="status/info" /><span data-slot="label" data-typography-role="subtitle-s">系统将在今晚自动完成更新。</span><span data-slot="content" data-typography-role="body-l"><span>查看详情</span></span><button className="tui-icon-button" type="button" aria-label="关闭"><Icon name="action/close" /></button></div>
  );
}

export default Alert;
