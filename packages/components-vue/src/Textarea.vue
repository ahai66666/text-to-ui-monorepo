<script setup>
import "./styles.css";
import { computed, ref } from "vue";
const props = defineProps({ modelValue: String, label: { type: String, default: "项目说明" }, placeholder: { type: String, default: "请输入内容" }, help: { type: String, default: "" }, disabled: Boolean, error: Boolean, state: { type: String, default: "default" }, surface: { type: String, default: "white" } });
const emit = defineEmits(["update:modelValue"]);
const focused = ref(false);
const resolvedState = computed(() => props.disabled ? "disabled" : props.state !== "default" ? props.state : props.error ? "error" : focused.value ? "focus" : "default");
</script>
<template>
  <label class="tui-component tui-textarea" data-component="textarea" data-logical-component="Textarea/Default" data-variant="default" :data-state="resolvedState" :data-surface="props.surface" data-framework="vue"><span data-slot="label" data-typography-role="body-m">{{ props.label }}</span><textarea data-slot="value" data-typography-role="body-l" :value="props.modelValue" :placeholder="props.placeholder" :disabled="props.disabled" :aria-invalid="props.error || props.state === 'error' ? 'true' : undefined" @focus="focused = true" @blur="focused = false" @input="emit('update:modelValue', $event.target.value)"></textarea><span v-if="props.help" data-slot="help" data-typography-role="caption-l">{{ props.help }}</span></label>
</template>
