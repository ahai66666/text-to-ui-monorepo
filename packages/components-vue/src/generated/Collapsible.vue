<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "更多信息" }, description: { type: String, default: "点击展开详情" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--disclosure" data-component="collapsible" data-logical-component="Collapsible/Default" data-variant="default" data-state="default" data-framework="vue">
    <button class="tui-generated__disclosure" type="button" :aria-expanded="open" aria-controls="collapsible-content" @click="open = !open" data-typography-role="body-l">
      <span data-slot="label" data-typography-role="body-l">更多信息</span>
      <svg class="tui-icon tui-icon--filled" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="filled"><path d="M12.792 15.312 18.528 9.648Q18.744 9.432 18.744 9.12Q18.744 8.808 18.528 8.568Q18.312 8.352 18 8.352Q17.688 8.352 17.448 8.568L12 13.992L6.528 8.568Q6.312 8.352 6 8.352Q5.688 8.352 5.472 8.568Q5.256 8.808 5.256 9.12Q5.256 9.432 5.472 9.648L11.208 15.312Q11.544 15.648 12 15.648Q12.456 15.648 12.792 15.312Z"/></svg>
    </button>
    <div class="tui-generated__disclosure-content" id="collapsible-content" data-slot="content" :hidden="!open" data-typography-role="body-l">点击展开详情</div>
  </div>
</template>
