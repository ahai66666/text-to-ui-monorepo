<script setup>
import { ref } from "vue";
import Icon from "../Icon.js";
const props = defineProps({ label: { type: String, default: "第 1–10 项" }, description: { type: String, default: "1  2  3  …" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <nav class="tui-generated tui-generated--pagination" data-component="pagination" data-logical-component="Pagination/Default" data-variant="default" data-state="default" data-framework="vue" aria-label="分页"><button class="tui-icon-button" type="button" aria-label="上一页"><Icon name="navigation/back" :size="20" /></button><button type="button" aria-current="page" data-typography-role="body-l">1</button><button type="button" data-typography-role="body-l">2</button><button type="button" data-typography-role="body-l">3</button><button class="tui-icon-button" type="button" aria-label="下一页"><Icon name="navigation/forward" :size="20" /></button></nav>
</template>
