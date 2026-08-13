import React from "react";
import { iconDefinitions, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "stroke-opacity": "strokeOpacity", "fill-rule": "fillRule", "fill-opacity": "fillOpacity", "clip-rule": "clipRule", "clip-path": "clipPath" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));
const iconChildren = (content, size, preservePaint = false) => [...content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw], index) => {
  const props = parseAttributes(raw);
  if (props.stroke) props.strokeWidth = iconStrokeWidths[size];
  if (!preservePaint && props.fill !== "none" && !props.stroke) props.fill = "currentColor";
  return React.createElement(tag, { ...props, key: `${tag}-${index}` });
});

export const Icon = ({ name, className = "", size = 20, decorative = true, ariaLabel = "" }) => {
  const definition = iconDefinitions[name];
  if (!definition) throw new Error(`Unknown icon semantic alias: ${name}`);
  if (![16, 20, 24].includes(Number(size))) throw new Error(`Unsupported icon display size: ${size}`);
  return React.createElement("svg", {
    className: `tui-icon tui-icon--regular${className ? ` ${className}` : ""}`,
    viewBox: definition.viewBox,
    width: size,
    height: size,
    "data-icon-alias": name,
    "data-icon-size": size,
    "data-icon-kind": "regular",
    "aria-hidden": decorative ? "true" : undefined,
    role: decorative ? undefined : "img",
    "aria-label": decorative ? undefined : ariaLabel
  }, iconChildren(definition.content, Number(size), definition.preservePaint === true));
};

export const contract = (id, logicalName, variant = "default", state = "default", extra = {}) => ({
  "data-component": id,
  "data-logical-component": logicalName,
  "data-variant": variant,
  "data-state": state,
  "data-framework": "react",
  ...extra,
});
