<script setup>
import "./styles.css";
import { computed, ref } from "vue";
const props = defineProps({ modelValue: String, label: { type: String, default: "通知方式" }, options: { type: Array, default: () => ["邮件", "站内消息"] } });
const emit = defineEmits(["update:modelValue", "change"]); const internal = ref(props.options[0]);
const selected = computed(() => props.modelValue === undefined ? internal.value : props.modelValue);
const change = (event) => { if (props.modelValue === undefined) internal.value = event.target.value; emit("update:modelValue", event.target.value); emit("change", event.target.value); };
</script>
<template><fieldset class="tui-component tui-choice tui-radio-group" data-component="radio-group" data-logical-component="Radio Group/Default" data-variant="default" data-state="default" data-framework="vue"><legend data-slot="label" data-typography-role="body-m">{{ props.label }}</legend><label v-for="option in props.options" :key="option"><input type="radio" name="runtime-radio" :value="option" :checked="selected === option" @change="change" /><span class="tui-radio__indicator" aria-hidden="true"></span><span data-typography-role="body-m">{{ option }}</span></label></fieldset></template>
