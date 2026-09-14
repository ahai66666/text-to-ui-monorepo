import React from "react";
import { Icon, contract } from "./shared.jsx";
import "./styles.css";

export function Chips({ label = "操作块", icon = "action/mark-important", leading, closable = true, disabled = false, state = "default", onClose, ...props }) {
  const resolvedState = disabled ? "disabled" : state;
  const variant = `${icon || leading ? "with-icon" : "text-only"}${closable ? "-closable" : ""}`;
  return <span className="tui-component tui-chip" {...contract("chips", "Chips/Default", variant, resolvedState, { "data-close": closable ? undefined : "false", "aria-disabled": disabled || undefined })} {...props}>
    {(icon || leading) && <span className="tui-chip__leading" data-slot="leading">{leading ?? <Icon name={icon} size={16} />}</span>}
    <span className="tui-chip__label" data-slot="label" data-typography-role="body-m">{label}</span>
    {closable && <button className="tui-chip__close" data-slot="close" type="button" aria-label={`移除 ${label}`} disabled={disabled} onClick={onClose}><Icon name="action/close" size={16} /></button>}
  </span>;
}
