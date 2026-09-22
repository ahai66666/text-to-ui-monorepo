<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  tabs: { type: Array, default: () => [
    { id: "overview", label: "概览", content: "项目概览" },
    { id: "activity", label: "活动", content: "项目活动" },
    { id: "settings", label: "设置", content: "项目设置" }
  ] }
});
const emit = defineEmits(["update:modelValue", "change"]);
const internal = ref(props.tabs[0]?.id);
const selected = computed(() => props.modelValue === undefined ? internal.value : props.modelValue);
const choose = (id) => {
  const tab = props.tabs.find((item) => item.id === id);
  if (props.disabled || !tab || tab.disabled) return;
  if (props.modelValue === undefined) internal.value = id;
  emit("update:modelValue", id);
  emit("change", id);
};
const keydown = (event) => {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
  event.preventDefault();
  const enabled = props.tabs.filter((tab) => !tab.disabled);
  const index = Math.max(0, enabled.findIndex((tab) => tab.id === event.target?.dataset?.tab));
  const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : enabled.length - 1;
  const next = enabled[(index + direction) % enabled.length];
  if (next) { choose(next.id); event.currentTarget.querySelector(`[data-tab="${next.id}"]`)?.focus(); }
};
</script>

<template>
  <div class="tui-component tui-sub-tabs" data-component="sub-tabs" data-logical-component="Sub Tabs/Default" data-variant="default" data-state="default" data-framework="vue">
    <div class="tui-sub-tabs__list" role="tablist" aria-label="子页签" @keydown="keydown">
      <button v-for="tab in props.tabs" :key="tab.id" :id="`sub-tab-${tab.id}`" type="button" role="tab" :data-tab="tab.id" :aria-controls="'sub-tabs-panel'" :aria-selected="selected === tab.id" :tabindex="selected === tab.id ? 0 : -1" :class="{ 'is-selected': selected === tab.id }" :data-typography-role="selected === tab.id ? 'subtitle-m' : 'body-l'" :disabled="props.disabled || tab.disabled" @click="choose(tab.id)">{{ tab.label }}</button>
    </div>
    <div id="sub-tabs-panel" class="tui-sub-tabs__panel" role="tabpanel" :aria-labelledby="`sub-tab-${selected}`" :data-tab-panel="selected" data-slot="content" data-typography-role="body-l">{{ props.tabs.find((tab) => tab.id === selected)?.content }}</div>
  </div>
</template>
