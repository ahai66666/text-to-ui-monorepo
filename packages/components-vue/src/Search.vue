<script setup>
import "./styles.css";
import { ref, computed } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: String, placeholder: { type: String, default: "搜索" }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
defineEmits(["update:modelValue", "clear"]);
const focused = ref(false);
const resolvedState = computed(() => props.disabled ? "disabled" : props.state === "default" && focused.value ? "focus" : props.state);
</script>
<template>
  <label class="tui-component tui-search" data-component="search" data-logical-component="Search/White Surface/Default" :data-variant="modelValue ? 'with-value' : 'default'" :data-state="resolvedState" :data-surface="surface" data-framework="vue"><span data-slot="leading"><Icon name="field/search" :size="16" /></span><input data-slot="value" data-typography-role="body-l" type="search" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @focus="focused = true" @blur="focused = false" @input="$emit('update:modelValue', $event.target.value)" /><button v-if="modelValue" class="tui-icon-button" data-slot="clear" type="button" aria-label="清除" @click="$emit('clear')"><Icon name="action/close" :size="16" /></button></label>
</template>
