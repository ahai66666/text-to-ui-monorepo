<script setup>
import "./styles.css";
import { computed, ref } from "vue";
const props = defineProps({ modelValue: Boolean, label: { type: String, default: "自动同步" }, description: { type: String, default: "已开启" }, disabled: Boolean });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(true);
const checked = computed(() => props.modelValue === undefined ? internal.value : props.modelValue);
const change = (event) => { if (props.modelValue === undefined) internal.value = event.target.checked; emit("update:modelValue", event.target.checked); emit("change", event.target.checked); };
</script>
<template><label class="tui-component tui-choice tui-switch" data-component="switch" data-logical-component="Switch/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : checked ? 'selected' : 'default'" data-framework="vue"><input type="checkbox" role="switch" :checked="checked" :disabled="props.disabled" @change="change" /><span class="tui-switch__track" aria-hidden="true"></span><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><span data-slot="description" data-typography-role="body-m">{{ props.description }}</span></label></template>
