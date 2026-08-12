import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Attachment({ label = "项目说明.pdf", description = "2.4 MB · 已上传", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "2.4 MB · 已上传";
  return (
    <article className="tui-generated tui-generated--card" data-component="attachment" data-logical-component="Attachment/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="action/download" /><div className="tui-generated__card-body"><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">2.4 MB · 已上传</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div></article>
  );
}

export default Attachment;
