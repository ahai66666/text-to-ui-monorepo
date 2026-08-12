<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "组件说明" }, description: { type: String, default: "查看组件的详细使用规则" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--floating" data-component="hover-card" data-logical-component="Hover Card/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">组件说明</button><div class="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">组件说明</span><span data-typography-role="body-m">查看组件的详细使用规则</span></div></div>
</template>
