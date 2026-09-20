<script setup>
import "./styles.css";
import { ref, computed } from "vue";
import Icon from "./Icon.js";
import Button from "./Button.vue";
const props = defineProps({ modelValue: String, placeholder: { type: String, default: "搜索" }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" }, advancedSearch: Boolean, advancedSearchLabel: { type: String, default: "高级搜索" } });
const emit = defineEmits(["update:modelValue", "clear", "advanced-search"]);
const focused = ref(false);
const internalValue = ref("");
const currentValue = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue);
const resolvedState = computed(() => props.disabled ? "disabled" : props.state === "default" && focused.value ? "focus" : props.state);
const update = (event) => { if (props.modelValue === undefined) internalValue.value = event.target.value; emit("update:modelValue", event.target.value); };
const clear = (event) => { if (props.modelValue === undefined) internalValue.value = ""; emit("clear", event); };
</script>
<template>
  <label class="tui-component tui-search" data-component="search" data-logical-component="Search/White Surface/Default" :data-variant="advancedSearch ? 'advanced-search' : currentValue ? 'with-value' : 'default'" :data-state="resolvedState" :data-surface="surface" data-framework="vue"><span data-slot="leading"><Icon name="field/search" :size="16" /></span><input data-slot="value" data-typography-role="body-l" type="search" :value="currentValue" :placeholder="placeholder" :disabled="disabled" @focus="focused = true" @blur="focused = false" @input="update" /><button v-if="currentValue" class="tui-icon-button" data-slot="clear" type="button" aria-label="清除" @click="clear"><Icon name="action/close" :size="16" /></button><Button v-if="advancedSearch" class="tui-search__advanced" :label="advancedSearchLabel" variant="ghost" size="small" mode="text" type="button" :aria-label="advancedSearchLabel" aria-haspopup="dialog" :disabled="disabled" data-slot="advanced-search" data-typography-role="body-m" @click="emit('advanced-search')" /></label>
</template>
