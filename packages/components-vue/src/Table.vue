<script setup>
import "./styles.css";
import Badge from "./Badge.vue";
const props = defineProps({ componentId: { type: String, default: "table" }, title: { type: String, default: "项目列表" }, rows: { type: Array, default: () => [["客户端设计系统", "赵博海", "进行中"], ["组件规范", "林晓", "已完成"]] } });
const logicalName = props.componentId === "data-table" ? "Data Table/Default" : "Table/Default";
</script>
<template><div class="tui-component tui-table" :data-component="props.componentId" :data-logical-component="logicalName" data-variant="default" data-state="default" data-framework="vue"><div class="tui-table__heading"><h4 data-slot="title" data-typography-role="title-s">{{ props.title }}</h4><span data-slot="description" data-typography-role="caption-l">{{ props.rows.length }} 个项目</span></div><table><thead><tr><th scope="col" data-typography-role="body-m">名称</th><th scope="col" data-typography-role="body-m">负责人</th><th scope="col" data-typography-role="body-m">状态</th></tr></thead><tbody><tr v-for="row in props.rows" :key="row.join('-')"><td data-typography-role="body-l">{{ row[0] }}</td><td data-typography-role="body-l">{{ row[1] }}</td><td data-typography-role="body-l"><Badge v-if="row[2] === '进行中'" label="进行中" tone="info" /><Badge v-else-if="row[2] === '已完成'" label="已完成" tone="success" /><template v-else>{{ row[2] }}</template></td></tr></tbody></table></div></template>
