import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Pagination({ label = "第 1–10 项", description = "1  2  3  …", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "1  2  3  …";
  return (
    <nav className="tui-generated tui-generated--pagination" data-component="pagination" data-logical-component="Pagination/Default" data-variant="default" data-state="default" data-framework="react" aria-label="分页"><button className="tui-icon-button" type="button" aria-label="上一页"><Icon name="navigation/back" size={20} /></button><button type="button" aria-current="page" data-typography-role="body-l">1</button><button type="button" data-typography-role="body-l">2</button><button type="button" data-typography-role="body-l">3</button><button className="tui-icon-button" type="button" aria-label="下一页"><Icon name="navigation/forward" size={20} /></button></nav>
  );
}

export default Pagination;
