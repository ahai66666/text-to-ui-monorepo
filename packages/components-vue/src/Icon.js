import { h } from "vue";
import { resolveIcon, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));

export default function Icon(props) {
  const requestedName = String(props.name ?? "").trim();
  const definition = resolveIcon(requestedName);
  const size = Number(props.size ?? 20);
  if (![16, 20, 24].includes(size)) throw new Error(`Unsupported icon display size: ${size}`);
  const iconStyle = props.iconStyle ?? "regular";
  if (!["regular", "solid"].includes(iconStyle)) throw new Error(`Unsupported icon style: ${iconStyle}`);
  const children = [...definition.content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw], index) => {
    const attrs = parseAttributes(raw);
    if (attrs.stroke) attrs.strokeWidth = iconStrokeWidths[size];
    if (!definition.preservePaint && attrs.fill !== "none" && !attrs.stroke) attrs.fill = "currentColor";
    return h(tag, { ...attrs, key: index });
  });
  return h("svg", {
    class: `tui-icon tui-icon--${iconStyle}${props.class ? ` ${props.class}` : ""}`,
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
    "aria-hidden": props.decorative !== false ? "true" : undefined,
    role: props.decorative === false ? "img" : undefined,
    "aria-label": props.decorative === false ? props.ariaLabel : undefined
  }, children);
}
