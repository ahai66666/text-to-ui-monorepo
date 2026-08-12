<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "概览  项目  成员" }, description: { type: String, default: "项目" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--tabs" data-component="tabs" data-logical-component="Tabs/Default" data-variant="default" data-state="default" data-framework="vue" role="tablist"><button class="tui-generated__tab is-selected" role="tab" aria-selected="true" data-typography-role="body-m">概览</button><button class="tui-generated__tab" role="tab" aria-selected="false" data-typography-role="body-m">项目</button><button class="tui-generated__tab" role="tab" aria-selected="false" data-typography-role="body-m">成员</button><div class="tui-generated__tab-panel" role="tabpanel" data-slot="content" data-typography-role="body-m">项目</div></div>
</template>
