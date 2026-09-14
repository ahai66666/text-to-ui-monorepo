<script setup>
import "./styles.css";
const props = defineProps({ label: { type: String, default: "进行中" }, tone: { type: String, default: "info" }, disabled: Boolean });
</script>
<template><span class="tui-component tui-badge" :class="`tui-badge--${['info', 'success', 'warning', 'danger', 'neutral'].includes(props.tone) ? props.tone : 'info'}`" data-component="badge" data-logical-component="Badge/Default" :data-variant="['info', 'success', 'warning', 'danger', 'neutral'].includes(props.tone) ? props.tone : 'info'" :data-state="props.disabled ? 'disabled' : 'default'" data-framework="vue" data-typography-role="body-s">{{ props.label }}</span></template>
