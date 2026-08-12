import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Item({ label = "HarmonyOS 组件规范", description = "刚刚更新 · 12 位成员", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "刚刚更新 · 12 位成员";
  return (
    <article className="tui-generated tui-generated--card" data-component="item" data-logical-component="Item/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="navigation/list" /><div className="tui-generated__card-body"><span data-slot="title" data-typography-role="title-s"><h4 data-typography-role="title-s">HarmonyOS 组件规范</h4></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">刚刚更新 · 12 位成员</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div><span data-slot="trailing" data-typography-role="body-m"><span className="tui-generated__badge" data-typography-role="caption-l">查看</span></span></article>
  );
}

export default Item;
