<script setup>
import "./styles.css";
import { computed, ref } from "vue";

const props = defineProps({ modelValue: String, options: { type: Array, default: () => ["列表", "看板", "时间线"] }, label: { type: String, default: "视图模式" }, disabled: Boolean });
const emit = defineEmits(["update:modelValue", "change"]);
const internalValue = ref(props.options[0]);
const selected = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue);
const choose = (value) => { if (props.disabled) return; if (props.modelValue === undefined) internalValue.value = value; emit("update:modelValue", value); emit("change", value); };
</script>

<template>
  <div class="tui-component tui-segmented-button" data-component="segmented-button" data-logical-component="Segmented Button/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : 'default'" data-framework="vue" role="group" :aria-label="props.label">
    <button v-for="option in props.options" :key="option" type="button" class="tui-segmented-button__item" :class="{ 'is-selected': selected === option }" :aria-pressed="selected === option" :disabled="props.disabled" data-slot="option" data-typography-role="body-m" @click="choose(option)">{{ option }}</button>
  </div>
</template>
