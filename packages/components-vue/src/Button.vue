<script setup>
import "./styles.css";
import { computed } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ label: String, variant: { type: String, default: "primary" }, size: { type: String, default: "standard" }, mode: { type: String, default: "text" }, state: { type: String, default: "default" }, disabled: Boolean, icon: { type: String, default: "" }, iconOnly: Boolean, logicalName: { type: String, default: "" } });
const logicalName = computed(() => {
  if (props.logicalName) return props.logicalName;
  if (props.mode === "icon-text") return "Button/Icon Text/Default";
  if (props.mode === "icon") return "Button/Icon/Default";
  if (props.mode === "split-dropdown") return `Split Dropdown Button/${props.iconOnly ? "Icon Only" : "Icon Text"}/Default`;
  return `Button/${props.variant.charAt(0).toUpperCase()}${props.variant.slice(1)}/Default`;
});
</script>
<template>
  <button class="tui-component tui-button" :class="{ 'tui-button--icon': mode === 'icon' || iconOnly }" type="button" data-component="button" :data-logical-component="logicalName" :data-variant="variant" :data-state="disabled ? 'disabled' : state" data-framework="vue" :data-mode="mode" :data-size="size" :aria-label="iconOnly ? label : undefined" :disabled="disabled">
    <span v-if="icon" data-slot="icon"><Icon :name="icon" :size="20" /></span><span v-if="mode !== 'icon' && !iconOnly" data-slot="label" :data-typography-role="size === 'small' ? 'body-m' : 'body-l'"><slot>{{ label }}</slot></span>
  </button>
</template>
