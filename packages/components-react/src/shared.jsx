import React from "react";
import { resolveIcon, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "stroke-opacity": "strokeOpacity", "fill-rule": "fillRule", "fill-opacity": "fillOpacity", "clip-rule": "clipRule", "clip-path": "clipPath" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));
const iconChildren = (content, size, preservePaint = false) => [...content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw], index) => {
  const props = parseAttributes(raw);
  if (props.stroke) props.strokeWidth = iconStrokeWidths[size];
  if (!preservePaint && props.fill !== "none" && !props.stroke) props.fill = "currentColor";
  return React.createElement(tag, { ...props, key: `${tag}-${index}` });
});

export const Icon = ({ name, className = "", size = 20, decorative = true, ariaLabel = "", iconStyle = "regular" }) => {
  const requestedName = String(name ?? "").trim();
  const definition = resolveIcon(requestedName);
  if (![16, 20, 24].includes(Number(size))) throw new Error(`Unsupported icon display size: ${size}`);
  if (!["regular", "solid"].includes(iconStyle)) throw new Error(`Unsupported icon style: ${iconStyle}`);
  return React.createElement("svg", {
    className: `tui-icon tui-icon--${iconStyle}${className ? ` ${className}` : ""}`,
    viewBox: definition.viewBox,
    width: size,
    height: size,
    "data-icon-alias": requestedName,
    "data-icon-size": size,
    "data-display-size-token": `size/${size}`,
    "data-icon-kind": iconStyle,
    "data-icon-resolution": definition.resolution,
    "data-icon-resolved-alias": definition.resolvedAlias ?? undefined,
    "data-icon-source": definition.source,
    "data-icon-name": definition.name,
    "data-icon-path": definition.path,
    "data-icon-manual-fallback": definition.manualFallback ? `unresolved:${requestedName}` : undefined,
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
