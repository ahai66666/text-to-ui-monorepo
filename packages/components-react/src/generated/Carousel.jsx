import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Carousel({ label = "内容 1 / 3", description = "项目概览", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "项目概览";
  return (
    <article className="tui-generated tui-generated--card" data-component="carousel" data-logical-component="Carousel/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="navigation/chevron-down" /><div className="tui-generated__card-body"><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">项目概览</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div></article>
  );
}

export default Carousel;
