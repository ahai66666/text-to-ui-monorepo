import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function AlertDialog({ label = "删除项目？", description = "删除后无法恢复，请确认操作。", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "删除后无法恢复，请确认操作。";
  return (
    <section className="tui-generated tui-generated--dialog" data-component="alert-dialog" data-logical-component="Alert Dialog/Default" data-variant="white" data-state="default" data-framework="react" role="dialog" aria-modal="true"><header data-slot="title"><h4 data-typography-role="title-s">删除项目？</h4><button className="tui-icon-button" type="button" aria-label="关闭"><Icon name="action/close" /></button></header><span data-slot="description" data-typography-role="body-m"><p data-typography-role="body-m">删除后无法恢复，请确认操作。</p></span><span data-slot="content" data-typography-role="body-l"><div className="tui-generated__content" data-typography-role="body-l">请确认后继续。</div></span><span data-slot="actions"><div className="tui-generated__actions"><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">取消</button><button className="tui-button" type="button" data-variant="primary" data-typography-role="body-l">确认</button></div></span></section>
  );
}

export default AlertDialog;
