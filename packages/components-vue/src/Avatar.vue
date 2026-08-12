<script setup>
import "./styles.css";
const props = defineProps({ initials: { type: String, default: "H" }, name: { type: String, default: "HarmonyOS" }, size: { type: Number, default: 40 }, disabled: Boolean });
</script>
<template><span class="tui-component tui-avatar" data-component="avatar" :data-logical-component="`Avatar/${props.size === 32 ? 32 : 40}/Fallback`" :data-variant="`size-${props.size === 32 ? 32 : 40}`" :data-size="props.size === 32 ? 32 : 40" :data-state="props.disabled ? 'disabled' : 'default'" data-framework="vue" :aria-label="props.name" :aria-disabled="props.disabled || undefined" data-typography-role="caption-l">{{ props.initials }}</span></template>
