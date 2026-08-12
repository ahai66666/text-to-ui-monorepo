<script setup>
import "./styles.css";
const props = defineProps({ title: { type: String, default: "暂无项目" }, description: { type: String, default: "创建项目后会显示在这里。" } });
const emit = defineEmits(["create"]);
</script>
<template><section class="tui-component tui-empty" data-component="empty" data-logical-component="Empty/Default" data-variant="default" data-state="default" data-framework="vue" aria-live="polite"><h4 data-slot="title" data-typography-role="title-s">{{ props.title }}</h4><p data-slot="description" data-typography-role="body-m">{{ props.description }}</p><button class="tui-button tui-empty__action" type="button" data-variant="primary" data-typography-role="body-l" @click="emit('create')">新建项目</button></section></template>
