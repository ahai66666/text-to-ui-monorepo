<script setup>
import "./styles.css";
import { computed, ref } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: { default: undefined }, title: { type: String, default: "项目设置" }, detail: { type: String, default: "基础信息、成员与通知方式" } });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(false); const isOpen = computed(() => props.modelValue === undefined ? internal.value : props.modelValue); const open = () => { const next = !isOpen.value; if (props.modelValue === undefined) internal.value = next; emit("update:modelValue", next); emit("change", next); };
</script>
<template><div class="tui-component tui-disclosure" data-component="accordion" data-logical-component="Accordion/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-disclosure__trigger" type="button" :aria-expanded="isOpen" aria-controls="accordion-content" @click="open"><Icon name="navigation/chevron-right" :size="20" /><span data-slot="label" data-typography-role="body-l">{{ props.title }}</span></button><div class="tui-disclosure__content" id="accordion-content" data-slot="content" :hidden="!isOpen" data-typography-role="body-l">{{ props.detail }}</div></div></template>
