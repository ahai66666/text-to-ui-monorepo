import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Slider({ label = "透明度", description = "80", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "80";
  return (
    <div className="tui-generated tui-generated--meter" data-component="slider" data-logical-component="Slider/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">透明度</span></span><div className="tui-generated__meter"><span style={{"--tui-meter-value": "84%"}}></span></div><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">80</small></span></div>
  );
}

export default Slider;
