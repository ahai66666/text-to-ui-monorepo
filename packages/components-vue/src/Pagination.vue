<script setup>
import "./styles.css";
import { ref } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ page: { type: Number, default: 1 }, total: { type: Number, default: 3 }, disabled: Boolean });
const emit = defineEmits(["change", "update:page"]);
const current = ref(props.page);
const choose = (next) => { const value = Math.min(props.total, Math.max(1, next)); if (props.disabled) return; current.value = value; emit("update:page", value); emit("change", value); };
</script>
<template><nav class="tui-component tui-pagination" data-component="pagination" data-logical-component="Pagination/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : 'default'" data-framework="vue" aria-label="分页"><button class="tui-icon-button" type="button" aria-label="上一页" :disabled="props.disabled || current === 1" @click="choose(current - 1)"><Icon name="navigation/back" :size="20" /></button><button v-for="value in props.total" :key="value" type="button" :aria-current="current === value ? 'page' : undefined" :disabled="props.disabled" data-typography-role="body-l" @click="choose(value)">{{ value }}</button><button class="tui-icon-button" type="button" aria-label="下一页" :disabled="props.disabled || current === props.total" @click="choose(current + 1)"><Icon name="navigation/forward" :size="20" /></button></nav></template>
