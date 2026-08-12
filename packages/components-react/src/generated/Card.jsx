import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Card({ label = "工作空间", description = "最近更新的项目与协作动态", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "最近更新的项目与协作动态";
  return (
    <article className="tui-generated tui-generated--card" data-component="card" data-logical-component="Card/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="navigation/grid" /><div className="tui-generated__card-body"><span data-slot="title" data-typography-role="title-s"><h4 data-typography-role="title-s">工作空间</h4></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">最近更新的项目与协作动态</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div><span data-slot="trailing" data-typography-role="body-m"><span className="tui-generated__badge" data-typography-role="caption-l">查看</span></span></article>
  );
}

export default Card;
