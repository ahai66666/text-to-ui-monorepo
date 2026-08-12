<script setup>
import "./styles.css";
const props = defineProps({ text: { type: String, default: "项目名称" }, forId: { type: String, default: "project-name" } });
</script>
<template><label class="tui-component tui-label" data-component="label" data-logical-component="Label/Default" data-variant="default" data-state="default" data-framework="vue" :for="props.forId" data-typography-role="body-m">{{ props.text }}</label></template>
