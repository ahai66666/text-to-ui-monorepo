<script setup>
import "./styles.css";
import { computed, nextTick, ref } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: String, label: { type: String, default: "负责人" }, options: { type: Array, default: () => ["选择成员", "林晓", "赵博海"] }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
const emit = defineEmits(["update:modelValue", "change"]);
const open = ref(false); const trigger = ref(null); const current = ref(props.modelValue ?? props.options[0]);
const selected = computed(() => props.modelValue === undefined ? current.value : props.modelValue);
const choose = (option) => { if (props.modelValue === undefined) current.value = option; emit("update:modelValue", option); emit("change", option); open.value = false; nextTick(() => trigger.value?.focus()); };
const onKeyDown = (event) => { if (props.disabled) return; const index = Math.max(0, props.options.indexOf(selected.value)); if (event.key === "Escape") { event.preventDefault(); open.value = false; trigger.value?.focus(); } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open.value = !open.value; } else if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (!open.value) open.value = true; else choose(props.options[(index + (event.key === "ArrowDown" ? 1 : props.options.length - 1)) % props.options.length]); } };
</script>
<template>
  <div class="tui-component tui-select" data-component="combobox" data-logical-component="Combobox/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : props.state" :data-surface="props.surface" data-framework="vue"><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><button ref="trigger" class="tui-select__trigger" type="button" role="combobox" aria-haspopup="listbox" :aria-expanded="open" aria-controls="combobox-options" :disabled="props.disabled" @click="open = !open" @keydown="onKeyDown"><span data-slot="value" data-typography-role="body-m">{{ selected }}</span><Icon name="navigation/chevron-down" :size="16" /></button><div id="combobox-options" class="tui-select__menu" role="listbox" :hidden="!open" :aria-label="props.label"><button v-for="option in props.options" :key="option" type="button" role="option" :aria-selected="option === selected" data-typography-role="body-l" @click="choose(option)">{{ option }}</button></div></div>
</template>
