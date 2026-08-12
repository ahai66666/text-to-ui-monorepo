import React from "react";
import { iconDefinitions, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));
const iconChildren = (content, kind, size, preservePaint = false) => [...content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw]) => {
  const props = parseAttributes(raw);
  if (kind === "outline") {
    if (props.fill === "none" || !props.fill) props.stroke = props.stroke ?? "currentColor";
    if (props.stroke) props.strokeWidth = iconStrokeWidths[size];
  } else if (!preservePaint) {
    props.fill = "currentColor";
    delete props.stroke;
    delete props.strokeWidth;
  }
  return React.createElement(tag, { ...props, key: `${tag}-${Object.keys(props).join("-")}` });
});

export const Icon = ({ name, className = "", size = 20, kind = "auto", decorative = true, ariaLabel = "" }) => {
  const definition = iconDefinitions[name];
  if (!definition) throw new Error(`Unknown icon semantic alias: ${name}`);
  if (![16, 20, 24].includes(Number(size))) throw new Error(`Unsupported icon display size: ${size}`);
  const resolvedKind = kind === "auto" ? definition.kind : kind;
  return React.createElement("svg", {
    className: `tui-icon tui-icon--${resolvedKind}${className ? ` ${className}` : ""}`,
    viewBox: definition.viewBox,
    width: size,
    height: size,
    "data-icon-alias": name,
    "data-icon-size": size,
    "data-icon-kind": resolvedKind,
    "aria-hidden": decorative ? "true" : undefined,
    role: decorative ? undefined : "img",
    "aria-label": decorative ? undefined : ariaLabel
  }, iconChildren(definition.content, resolvedKind, Number(size), definition.preservePaint === true));
};

export const contract = (id, logicalName, variant = "default", state = "default", extra = {}) => ({
  "data-component": id,
  "data-logical-component": logicalName,
  "data-variant": variant,
  "data-state": state,
  "data-framework": "react",
  ...extra,
});
