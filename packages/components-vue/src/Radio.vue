<script setup>
import "./styles.css";
import { computed, ref } from "vue";
const props = defineProps({ modelValue: { type: Boolean, default: undefined }, label: { type: String, default: "邮件" }, name: { type: String, default: "radio" }, value: { type: String, default: "邮件" }, disabled: Boolean });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(false);
const checked = computed(() => props.modelValue === undefined ? internal.value : props.modelValue);
const change = (event) => { if (props.modelValue === undefined) internal.value = event.target.checked; emit("update:modelValue", event.target.checked); emit("change", event.target.checked); };
</script>
<template><label class="tui-component tui-choice tui-radio" data-component="radio" data-logical-component="Radio/Unselected/Default" :data-variant="checked ? 'selected' : 'unselected'" :data-state="props.disabled ? 'disabled' : checked ? 'selected' : 'default'" data-framework="vue"><input type="radio" :name="props.name" :value="props.value" :checked="checked" :disabled="props.disabled" @change="change" /><span class="tui-radio__indicator" data-slot="control" aria-hidden="true"></span><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span></label></template>
