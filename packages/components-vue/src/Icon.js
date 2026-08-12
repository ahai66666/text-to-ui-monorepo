import { h } from "vue";
import { iconDefinitions, iconStrokeWidths } from "./icon-map.js";

const attrNames = { "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule" };
const parseAttributes = (source) => Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [attrNames[key] ?? key, value]));

export default function Icon(props) {
  const definition = iconDefinitions[props.name];
  if (!definition) throw new Error(`Unknown icon semantic alias: ${props.name}`);
  const size = Number(props.size ?? 20);
  if (![16, 20, 24].includes(size)) throw new Error(`Unsupported icon display size: ${size}`);
  const kind = props.kind === "auto" || !props.kind ? definition.kind : props.kind;
  const children = [...definition.content.matchAll(/<(path|circle|rect|line|polyline|polygon)\s+([^>]*?)\s*\/?>(?:<\/\1>)?/g)].map(([, tag, raw], index) => {
    const attrs = parseAttributes(raw);
    if (kind === "outline") {
      if (attrs.fill === "none" || !attrs.fill) attrs.stroke = attrs.stroke ?? "currentColor";
      if (attrs.stroke) attrs.strokeWidth = iconStrokeWidths[size];
    } else if (!definition.preservePaint) {
      attrs.fill = "currentColor";
      delete attrs.stroke;
      delete attrs.strokeWidth;
    }
    return h(tag, { ...attrs, key: index });
  });
  return h("svg", {
    class: `tui-icon tui-icon--${kind}${props.class ? ` ${props.class}` : ""}`,
    viewBox: definition.viewBox,
    width: size,
    height: size,
    "data-icon-alias": props.name,
    "data-icon-size": size,
    "data-icon-kind": kind,
    "aria-hidden": props.decorative !== false ? "true" : undefined,
    role: props.decorative === false ? "img" : undefined,
    "aria-label": props.decorative === false ? props.ariaLabel : undefined
  }, children);
}
