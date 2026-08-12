<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "项目列表" }, description: { type: String, default: "名称 / 负责人 / 状态" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--table" data-component="data-table" data-logical-component="Data Table/Default" data-variant="default" data-state="default" data-framework="vue"><div class="tui-generated__heading"><span data-slot="title" data-typography-role="title-s">项目列表</span><span data-slot="description" data-typography-role="body-m">名称 / 负责人 / 状态</span></div><table><thead><tr><th data-typography-role="body-m">名称</th><th data-typography-role="body-m">负责人</th><th data-typography-role="body-m">状态</th></tr></thead><tbody><tr><td data-slot="content" data-typography-role="body-l">客户端设计系统</td><td data-typography-role="body-l">赵博海</td><td data-typography-role="body-l"><span class="tui-generated__badge" data-typography-role="caption-l">进行中</span></td></tr><tr><td data-typography-role="body-l">组件规范</td><td data-typography-role="body-l">林晓</td><td data-typography-role="body-l">已完成</td></tr></tbody></table></div>
</template>
