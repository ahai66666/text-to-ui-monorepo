<script setup>
import "./styles.css";
import Icon from "./Icon.js";
defineProps({ items: { type: Array, default: () => [] }, selected: String });
defineEmits(["select"]);
</script>
<template>
  <nav class="tui-component tui-sidebar" data-component="sidebar" data-logical-component="Sidebar Item/Default" data-variant="default" data-state="default" data-framework="vue" aria-label="主导航"><slot><button v-for="item in items" :key="item.id || item.label" class="tui-sidebar-item" type="button" :data-state="item.id === selected ? 'selected' : item.state || 'default'" :disabled="item.disabled || item.state === 'disabled'" @click="$emit('select', item.id)"><span data-slot="leading"><Icon :name="item.iconAlias || item.icon || 'navigation/grid'" :size="20" /></span><span data-slot="label" data-typography-role="body-l">{{ item.label }}</span><span v-if="item.count !== undefined" class="tui-sidebar-item__count" data-slot="trailing" data-typography-role="body-m">{{ item.count }}</span></button></slot></nav>
</template>
