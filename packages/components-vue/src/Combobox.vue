<script setup>
import "./styles.css";
import { computed, nextTick, ref, watch } from "vue";
import Icon from "./Icon.js";
const props = defineProps({ modelValue: String, label: { type: String, default: "字体" }, options: { type: Array, default: () => ["思源黑体", "源然雅黑", "鸿蒙黑体", "宋体", "黑体"] }, disabled: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
const emit = defineEmits(["update:modelValue", "change"]);
const open = ref(false); const filterActive = ref(false); const trigger = ref(null); const current = ref(props.modelValue ?? props.options[0]); const query = ref(current.value);
const selected = computed(() => props.modelValue === undefined ? current.value : props.modelValue);
const filteredOptions = computed(() => filterActive.value ? props.options.filter((option) => option.toLowerCase().includes(query.value.trim().toLowerCase())) : props.options);
watch(() => props.modelValue, (value) => { if (value !== undefined) { current.value = value; query.value = value; } });
const choose = (option) => { if (props.modelValue === undefined) current.value = option; query.value = option; filterActive.value = false; emit("update:modelValue", option); emit("change", option); open.value = false; nextTick(() => trigger.value?.focus()); };
const onInput = () => { filterActive.value = true; open.value = true; };
const onKeyDown = (event) => { if (props.disabled) return; if (event.key === "Escape") { event.preventDefault(); open.value = false; trigger.value?.focus(); return; } if (event.key === "Enter") { event.preventDefault(); const match = props.options.find((option) => option.toLowerCase() === query.value.trim().toLowerCase()); if (match) choose(match); else open.value = true; return; } if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (!open.value) open.value = true; else if (filteredOptions.value.length) choose(filteredOptions.value[event.key === "ArrowDown" ? 0 : filteredOptions.value.length - 1]); } };
</script>
<template>
  <div class="tui-component tui-select tui-combobox" data-component="combobox" data-logical-component="Combobox/Default" data-variant="default" :data-state="props.disabled ? 'disabled' : props.state" :data-surface="props.surface" data-framework="vue"><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><div class="tui-select__trigger tui-combobox__trigger" @click="filterActive = false; open = true"><input ref="trigger" v-model="query" class="tui-combobox__input" data-slot="value" data-typography-role="body-m" type="text" role="combobox" aria-haspopup="listbox" :aria-expanded="open" aria-controls="combobox-options" aria-autocomplete="list" autocomplete="off" :disabled="props.disabled" @input="onInput" @keydown="onKeyDown" /><span class="tui-combobox__chevron" aria-hidden="true"><Icon name="navigation/chevron-down" :size="16" /></span></div><div id="combobox-options" class="tui-select__menu" role="listbox" :hidden="!open" :aria-label="props.label"><button v-for="option in filteredOptions" :key="option" type="button" role="option" :aria-selected="option === selected" data-typography-role="body-l" @click="choose(option)">{{ option }}</button></div></div>
</template>
