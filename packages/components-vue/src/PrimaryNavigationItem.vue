<script setup>
import "./styles.css";
import Icon from "./Icon.js";
const primaryNavigationIconAliases = Object.freeze({
  "primary-level/overview": "navigation/grid",
  "primary-level/calendar": "field/calendar",
  "primary-level/contacts": "navigation/contacts",
  "primary-level/mail": "navigation/mail-unread",
  "primary-level/settings": "action/settings"
});
const resolvePrimaryNavigationIcon = (name) => primaryNavigationIconAliases[name] ?? name;
const primaryNavigationAllowedIconAliases = new Set(["navigation/grid", "field/calendar", "navigation/contacts", "navigation/mail-unread", "action/settings"]);
const checkedPrimaryNavigationIcon = (name) => {
  const alias = resolvePrimaryNavigationIcon(name);
  if (!primaryNavigationAllowedIconAliases.has(alias)) throw new Error(`Primary Navigation Item requires an approved Lucide Regular icon alias: ${alias}`);
  return alias;
};

const props = defineProps({
  label: { type: String, default: "项目" },
  ariaLabel: { type: String, default: "" },
  icon: { type: String, default: "navigation/grid" },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  state: { type: String, default: "default" },
  className: { type: String, default: "" }
});
const emit = defineEmits(["select"]);
</script>

<template>
  <button
    type="button"
    :class="['tui-component', 'tui-primary-navigation-item', props.className]"
    data-component="primary-navigation-item"
    data-logical-component="Primary Navigation Item/Level 1"
    :data-variant="props.selected ? 'selected' : 'default'"
    :data-state="props.disabled ? 'disabled' : props.selected ? 'selected' : props.state"
    data-framework="vue"
    data-placement="primary-navigation-shell"
    data-mode="icon-only"
    :aria-label="props.ariaLabel || props.label"
    :aria-pressed="String(props.selected)"
    :disabled="props.disabled || props.state === 'disabled'"
    @click="emit('select', props.label)"
  >
    <span data-slot="icon"><Icon :name="checkedPrimaryNavigationIcon(props.icon)" :size="24" /></span>
  </button>
</template>
