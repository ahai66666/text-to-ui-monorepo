<script setup>
import "./styles.css";
import { ref, computed } from "vue";
import Icon from "./Icon.js";
import Button from "./Button.vue";
const props = defineProps({ modelValue: String, placeholder: { type: String, default: "搜索" }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" }, advancedSearch: Boolean, advancedSearchLabel: { type: String, default: "高级搜索" } });
defineEmits(["update:modelValue", "clear", "advanced-search"]);
const focused = ref(false);
const resolvedState = computed(() => props.disabled ? "disabled" : props.state === "default" && focused.value ? "focus" : props.state);
</script>
<template>
  <label class="tui-component tui-search" data-component="search" data-logical-component="Search/White Surface/Default" :data-variant="advancedSearch ? 'advanced-search' : modelValue ? 'with-value' : 'default'" :data-state="resolvedState" :data-surface="surface" data-framework="vue"><span data-slot="leading"><Icon name="field/search" :size="16" /></span><input data-slot="value" data-typography-role="body-l" type="search" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @focus="focused = true" @blur="focused = false" @input="$emit('update:modelValue', $event.target.value)" /><button v-if="modelValue" class="tui-icon-button" data-slot="clear" type="button" aria-label="清除" @click="$emit('clear')"><Icon name="action/close" :size="16" /></button><Button v-if="advancedSearch" class="tui-search__advanced" :label="advancedSearchLabel" variant="ghost" size="small" mode="text" type="button" :aria-label="advancedSearchLabel" aria-haspopup="dialog" :disabled="disabled" data-slot="advanced-search" data-typography-role="body-m" @click="$emit('advanced-search')" /></label>
</template>
