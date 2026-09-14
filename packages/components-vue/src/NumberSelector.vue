<script setup>
import "./styles.css";
import { computed, ref } from "vue";
import Icon from "./Icon.js";

const props = defineProps({ modelValue: Number, defaultValue: { type: Number, default: 1 }, min: { type: Number, default: 0 }, max: { type: Number, default: 99 }, step: { type: Number, default: 1 }, label: { type: String, default: "数量" }, disabled: Boolean });
const emit = defineEmits(["update:modelValue", "change"]);
const internalValue = ref(props.defaultValue);
const selected = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue);
const update = (value) => {
  const numeric = Number(value);
  const next = Math.min(props.max, Math.max(props.min, Number.isFinite(numeric) ? numeric : props.min));
  if (props.modelValue === undefined) internalValue.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};
</script>

<template>
  <label class="tui-component tui-number-selector" data-component="number-selector" data-logical-component="Number Selector/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : 'default'" data-framework="vue">
    <span data-slot="label" data-typography-role="body-m">{{ props.label }}</span>
    <span class="tui-number-selector__control"><input type="number" data-slot="value" data-typography-role="body-l" :value="selected" :min="props.min" :max="props.max" :step="props.step" :disabled="props.disabled" @input="update($event.target.value)" /><span class="tui-number-selector__stepper" :aria-label="`调整${props.label}`"><button type="button" class="tui-number-selector__step" data-slot="increment" data-direction="increment" :aria-label="`增加${props.label}`" :disabled="props.disabled || selected >= props.max" @click="update(selected + props.step)"><Icon name="navigation/chevron-up" :size="16" /></button><button type="button" class="tui-number-selector__step" data-slot="decrement" data-direction="decrement" :aria-label="`减少${props.label}`" :disabled="props.disabled || selected <= props.min" @click="update(selected - props.step)"><Icon name="navigation/chevron-down" :size="16" /></button></span></span>
  </label>
</template>
