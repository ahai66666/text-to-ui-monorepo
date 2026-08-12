<script setup>
import "./styles.css";
import { computed, ref } from "vue";
const props = defineProps({ modelValue: String, placeholder: { type: String, default: "请输入内容" }, disabled: Boolean, error: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
defineEmits(["update:modelValue"]);
const focused = ref(false);
const resolvedState = computed(() => props.disabled ? "disabled" : props.state !== "default" ? props.state : props.error ? "error" : focused.value ? "focus" : "default");
</script>
<template>
  <label class="tui-component tui-input" data-component="input" data-logical-component="Input/White Surface/Default" data-variant="default" :data-state="resolvedState" :data-surface="surface" data-framework="vue"><input data-slot="value" data-typography-role="body-l" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :aria-invalid="error || state === 'error' ? 'true' : undefined" @focus="focused = true" @blur="focused = false" @input="$emit('update:modelValue', $event.target.value)" /></label>
</template>
