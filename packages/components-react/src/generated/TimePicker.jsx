import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function TimePicker({ label = "时间", description = "09:30", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "09:30";
  return (
    <div className="tui-generated tui-generated--picker" data-component="time-picker" data-logical-component="Time Picker/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-m"><span data-typography-role="body-m">时间</span></span><button className="tui-generated__control" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="field/clock" /><span data-slot="value" data-typography-role="body-m">09:30</span><Icon name="navigation/chevron-down" /></button><div className="tui-generated__panel" data-slot="content" hidden={!open}><span data-typography-role="caption-l">选择时间</span><div className="tui-generated__placeholder">01 · 02 · 03 · 04 · 05</div></div></div>
  );
}

export default TimePicker;
