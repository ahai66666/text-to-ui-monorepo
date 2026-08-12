<script setup>
import "./styles.css";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: String, label: { type: String, default: "视图" }, options: { type: Array, default: () => ["列表视图", "网格视图", "紧凑视图"] }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
const emit = defineEmits(["update:modelValue", "change"]);
</script>
<template>
  <label class="tui-component tui-native-select" data-component="native-select" data-logical-component="Native Select/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : props.state" :data-surface="props.surface" data-framework="vue"><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><span class="tui-native-select__control"><select data-slot="value" data-typography-role="body-l" :value="props.modelValue" :disabled="props.disabled" @change="emit('update:modelValue', $event.target.value); emit('change', $event.target.value)"><option v-for="option in props.options" :key="option" :value="option">{{ option }}</option></select><Icon name="navigation/chevron-down" :size="16" /></span></label>
</template>
