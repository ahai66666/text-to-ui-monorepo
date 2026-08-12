<script setup>
import "./styles.css";
const props = defineProps({ title: { type: String, default: "HarmonyOS 组件规范" }, description: { type: String, default: "统一客户端中的布局、组件与交互规则。" } });
</script>
<template><article class="tui-component tui-card" data-component="card" data-logical-component="Card/Default" data-variant="default" data-state="default" data-framework="vue"><div class="tui-card__body"><h4 data-slot="title" data-typography-role="title-s">{{ props.title }}</h4><p data-slot="description" data-typography-role="body-m">{{ props.description }}</p><div v-if="$slots.default" data-slot="content" data-typography-role="body-l"><slot /></div></div></article></template>
