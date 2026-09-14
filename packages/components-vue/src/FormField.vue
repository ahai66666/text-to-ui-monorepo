<script setup>
import "./styles.css";
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "项目名称" },
  required: Boolean,
  error: { type: String, default: "" },
  disabled: Boolean,
  state: { type: String, default: "default" },
  surface: { type: String, default: "white" }
});
const resolvedState = computed(() => props.disabled ? "disabled" : props.state !== "default" ? props.state : props.error ? "error" : "default");
</script>

<template>
  <section class="tui-component tui-form-field" data-component="form-field" data-logical-component="Form Field/Default" data-variant="default" :data-state="resolvedState" :data-surface="props.surface" :data-required="props.required" data-framework="vue">
    <span data-slot="label" data-typography-role="subtitle-s"><span v-if="props.required" class="tui-form-field__required" aria-hidden="true">*</span>{{ props.label }}</span>
    <div class="tui-form-field__control" data-slot="control"><slot /></div>
    <span v-if="props.error" class="tui-form-field__error" data-slot="error" role="alert" data-typography-role="body-s">{{ props.error }}</span>
  </section>
</template>
