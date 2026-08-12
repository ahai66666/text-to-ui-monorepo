import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function SemiModal({ label = "编辑项目", description = "白色内容面上的半模态表单", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "白色内容面上的半模态表单";
  return (
    <section className="tui-generated tui-generated--dialog" data-component="semi-modal" data-logical-component="Semi-modal/Default" data-variant="white" data-state="default" data-framework="react" role="dialog" aria-modal="false"><header data-slot="title"><h4 data-typography-role="title-s">编辑项目</h4><button className="tui-icon-button" type="button" aria-label="关闭"><Icon name="action/close" /></button></header><span data-slot="description" data-typography-role="body-m"><p data-typography-role="body-m">白色内容面上的半模态表单</p></span><span data-slot="content" data-typography-role="body-l"><div className="tui-generated__content" data-typography-role="body-l">请确认后继续。</div></span><span data-slot="actions"><div className="tui-generated__actions"><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">取消</button><button className="tui-button" type="button" data-variant="primary" data-typography-role="body-l">确认</button></div></span></section>
  );
}

export default SemiModal;
