<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "操作菜单" }, description: { type: String, default: "新建、导入、导出" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--menu" data-component="dropdown-menu" data-logical-component="Dropdown Menu/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">操作菜单</span></span><button class="tui-generated__control" type="button" aria-haspopup="menu" :aria-expanded="open" @click="open = !open"><span data-slot="value" data-typography-role="body-m">新建、导入、导出</span><svg class="tui-icon tui-icon--filled" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="filled"><path d="M12.792 15.312 18.528 9.648Q18.744 9.432 18.744 9.12Q18.744 8.808 18.528 8.568Q18.312 8.352 18 8.352Q17.688 8.352 17.448 8.568L12 13.992L6.528 8.568Q6.312 8.352 6 8.352Q5.688 8.352 5.472 8.568Q5.256 8.808 5.256 9.12Q5.256 9.432 5.472 9.648L11.208 15.312Q11.544 15.648 12 15.648Q12.456 15.648 12.792 15.312Z"/></svg></button><div class="tui-generated__menu" role="menu" data-slot="content" :hidden="!open"><button type="button" role="menuitem" data-typography-role="body-l">新建、导入、导出</button><button type="button" role="menuitem" data-typography-role="body-l">全部项目</button><button type="button" role="menuitem" data-typography-role="body-l">最近访问</button></div></div>
</template>
