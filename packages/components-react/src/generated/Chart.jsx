import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Chart({ label = "项目趋势", description = "84%", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "84%";
  return (
    <article className="tui-generated tui-generated--card" data-component="chart" data-logical-component="Chart/Default" data-variant="default" data-state="default" data-framework="react"><Icon name="navigation/grid" /><div className="tui-generated__card-body"><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">84%</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div></article>
  );
}

export default Chart;
