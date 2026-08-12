<script setup>
import "./styles.css";
import Icon from "./Icon.js";
import { ref } from "vue";
const props = defineProps({ message: { type: String, default: "系统将在今晚自动完成更新。" }, action: { type: String, default: "查看详情" }, tone: { type: String, default: "info" } });
const emit = defineEmits(["action", "close"]); const visible = ref(true);
const toneIcons = { info: "status/info", success: "status/success", warning: "status/warning", danger: "status/danger", neutral: "status/neutral" };
</script>
<template><div v-if="visible" class="tui-component tui-alert" :class="`tui-alert--${props.tone}`" data-component="alert" data-logical-component="Alert/Default" :data-variant="props.tone" data-state="default" data-framework="vue" :role="props.tone === 'warning' || props.tone === 'danger' ? 'alert' : 'status'"><span class="tui-alert__icon"><Icon :name="toneIcons[props.tone] ?? toneIcons.info" :size="20" /></span><span class="tui-alert__message" data-slot="content" data-typography-role="subtitle-s">{{ props.message }}</span><span class="tui-alert__actions" data-slot="actions"><button class="tui-button tui-button--ghost tui-alert__action" data-slot="action" type="button" data-variant="ghost" data-size="small" data-typography-role="body-m" @click="emit('action')">{{ props.action }}</button><button class="tui-icon-button" data-slot="close" type="button" aria-label="关闭" @click="visible = false; emit('close')"><Icon name="action/close" :size="20" /></button></span></div></template>
