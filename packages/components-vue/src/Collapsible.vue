<script setup>
import "./styles.css";
import { computed, ref } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: { default: undefined }, title: { type: String, default: "更多信息" }, detail: { type: String, default: "点击展开查看详情" } });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(false); const isOpen = computed(() => props.modelValue === undefined ? internal.value : props.modelValue); const open = () => { const next = !isOpen.value; if (props.modelValue === undefined) internal.value = next; emit("update:modelValue", next); emit("change", next); };
</script>
<template><div class="tui-component tui-disclosure" data-component="collapsible" data-logical-component="Collapsible/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-disclosure__trigger" type="button" :aria-expanded="isOpen" aria-controls="collapsible-content" @click="open"><span data-slot="label" data-typography-role="body-l">{{ props.title }}</span><Icon name="navigation/chevron-down" :size="20" /></button><div class="tui-disclosure__content" id="collapsible-content" data-slot="content" :hidden="!isOpen" data-typography-role="body-l">{{ props.detail }}</div></div></template>
