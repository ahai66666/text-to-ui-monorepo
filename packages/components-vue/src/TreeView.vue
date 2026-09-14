<script setup>
import { computed, ref } from "vue";
import Icon from "./Icon.js";

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  expanded: { type: Array, default: () => ["workspace", "projects"] },
  nodes: { type: Array, default: () => [
    { id: "workspace", label: "工作空间", trailing: "24", children: [
      { id: "projects", label: "项目", trailing: "12", children: [
        { id: "design-system", label: "设计系统" },
        { id: "component-library", label: "组件库" }
      ] },
      { id: "members", label: "成员", trailing: "8" }
    ] },
    { id: "archive", label: "归档" }
  ] }
});
const emit = defineEmits(["update:modelValue", "select", "toggle"]);
const internalSelected = ref(props.modelValue ?? "design-system");
const selected = computed(() => props.modelValue === undefined ? internalSelected.value : props.modelValue);
const expanded = ref(new Set(props.expanded));
const flatten = (nodes, depth = 1, result = []) => {
  nodes.forEach((node) => {
    result.push({ node, depth });
    if (node.children?.length && expanded.value.has(node.id)) flatten(node.children, depth + 1, result);
  });
  return result;
};
const visibleNodes = computed(() => flatten(props.nodes));
const toggle = (node) => {
  if (props.disabled || node.disabled || !node.children?.length) return;
  const next = new Set(expanded.value);
  if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
  expanded.value = next;
  emit("toggle", node.id, next.has(node.id));
};
const choose = (node) => {
  if (props.disabled || node.disabled) return;
  if (props.modelValue === undefined) internalSelected.value = node.id;
  emit("update:modelValue", node.id);
  emit("select", node.id);
};
const keydown = (event) => {
  const index = visibleNodes.value.findIndex(({ node }) => node.id === event.currentTarget.dataset.nodeId);
  if (index < 0) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const next = visibleNodes.value[index + (event.key === "ArrowDown" ? 1 : -1)];
    next && event.currentTarget.parentElement?.querySelector(`[data-node-id="${next.node.id}"]`)?.focus();
  } else if (event.key === "ArrowRight" && event.currentTarget.getAttribute("aria-expanded") === "false") {
    event.preventDefault(); toggle(visibleNodes.value[index].node);
  } else if (event.key === "ArrowLeft" && event.currentTarget.getAttribute("aria-expanded") === "true") {
    event.preventDefault(); toggle(visibleNodes.value[index].node);
  }
};
</script>

<template>
  <nav class="tui-component tui-tree-view" data-component="tree-view" data-logical-component="Tree View/Default" data-variant="default" data-state="default" data-framework="vue" aria-label="项目结构" role="tree">
    <button v-for="item in visibleNodes" :key="item.node.id" type="button" role="treeitem" :class="['tui-tree-view__item', { 'is-selected': selected === item.node.id }]" :data-node-id="item.node.id" :data-tree-depth="item.depth" :style="{ '--tree-indent': `${Math.max(0, item.depth - 1) * 12}px` }" :aria-level="item.depth" :aria-selected="selected === item.node.id" :aria-expanded="item.node.children?.length ? expanded.has(item.node.id) : undefined" :disabled="props.disabled || item.node.disabled" @click="item.node.children?.length ? (toggle(item.node), choose(item.node)) : choose(item.node)" @keydown="keydown">
      <span :class="['tui-tree-view__chevron', { 'has-children': item.node.children?.length, 'is-expanded': expanded.has(item.node.id) }]" aria-hidden="true"><Icon v-if="item.node.children?.length" name="navigation/chevron-right" :size="20" /></span>
      <span class="tui-tree-view__icon" data-slot="leading" aria-hidden="true"><Icon :name="item.node.children?.length ? 'navigation/grid' : 'object/file'" :size="20" /></span>
      <span class="tui-tree-view__label" data-slot="label" data-typography-role="body-l">{{ item.node.label }}</span>
      <span v-if="item.node.trailing" class="tui-tree-view__trailing" data-slot="trailing" data-typography-role="body-m">{{ item.node.trailing }}</span>
    </button>
  </nav>
</template>
