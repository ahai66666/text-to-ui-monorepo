<script setup>
import "./styles.css";
import { computed, ref } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: { type: Boolean, default: undefined }, label: { type: String, default: "同步到云端" }, description: { type: String, default: "保存后自动同步" }, disabled: Boolean });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(true);
const checked = computed(() => props.modelValue === undefined ? internal.value : props.modelValue);
const change = (event) => { if (props.modelValue === undefined) internal.value = event.target.checked; emit("update:modelValue", event.target.checked); emit("change", event.target.checked); };
</script>
<template><label class="tui-component tui-choice tui-checkbox" data-component="checkbox" data-logical-component="Checkbox/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : checked ? 'selected' : 'default'" data-framework="vue"><input type="checkbox" :checked="checked" :disabled="props.disabled" @change="change" /><span class="tui-checkbox__indicator" aria-hidden="true"><Icon name="choice/check" :size="16" /></span><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><span data-slot="description" data-typography-role="body-m">{{ props.description }}</span></label></template>
