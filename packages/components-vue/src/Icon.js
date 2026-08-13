import { h } from "vue";
import { iconDefinitions, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));

export default function Icon(props) {
  const definition = iconDefinitions[props.name];
  if (!definition) throw new Error(`Unknown icon semantic alias: ${props.name}`);
  const size = Number(props.size ?? 20);
  if (![16, 20, 24].includes(size)) throw new Error(`Unsupported icon display size: ${size}`);
  const children = [...definition.content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw], index) => {
    const attrs = parseAttributes(raw);
    if (attrs.stroke) attrs.strokeWidth = iconStrokeWidths[size];
    if (!definition.preservePaint && attrs.fill !== "none" && !attrs.stroke) attrs.fill = "currentColor";
    return h(tag, { ...attrs, key: index });
  });
  return h("svg", {
    class: `tui-icon tui-icon--regular${props.class ? ` ${props.class}` : ""}`,
    viewBox: definition.viewBox,
    width: size,
    height: size,
    "data-icon-alias": props.name,
    "data-icon-size": size,
    "data-icon-kind": "regular",
    "aria-hidden": props.decorative !== false ? "true" : undefined,
    role: props.decorative === false ? "img" : undefined,
    "aria-label": props.decorative === false ? props.ariaLabel : undefined
  }, children);
}
