<script setup>
import "./styles.css";
import { computed, useSlots } from "vue";
import Icon from "./Icon.js";

const props = defineProps({
  label: { type: String, default: "操作块" },
  icon: { type: String, default: "action/mark-important" },
  closable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  state: { type: String, default: "default" }
});
const emit = defineEmits(["close"]);
const slots = useSlots();
const resolvedState = computed(() => props.disabled ? "disabled" : props.state);
const variant = computed(() => `${props.icon || Boolean(slots.leading) ? "with-icon" : "text-only"}${props.closable ? "-closable" : ""}`);
</script>

<template>
  <span class="tui-component tui-chip" data-component="chips" data-renderer-key="chips" data-logical-component="Chips/Default" :data-variant="variant" :data-state="resolvedState" data-framework="vue" :data-close="closable ? undefined : 'false'" :aria-disabled="disabled || undefined">
    <span v-if="icon || $slots.leading" class="tui-chip__leading" data-slot="leading"><slot name="leading"><Icon :name="icon" :size="16" /></slot></span>
    <span class="tui-chip__label" data-slot="label" data-typography-role="body-m"><slot name="label">{{ label }}</slot></span>
    <slot name="close"><button v-if="closable" class="tui-chip__close" data-slot="close" type="button" :aria-label="`移除 ${label}`" :disabled="disabled" @click="emit('close')"><Icon name="action/close" :size="16" /></button></slot>
  </span>
</template>
