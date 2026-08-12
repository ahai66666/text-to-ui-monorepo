<script setup>
import "./styles.css";
const props = defineProps({ items: { type: Array, default: () => ["工作空间", "项目", "设置"] } });
const emit = defineEmits(["navigate"]);
</script>
<template><nav class="tui-component tui-breadcrumb" data-component="breadcrumb" data-logical-component="Breadcrumb/Default" data-variant="default" data-state="default" data-framework="vue" aria-label="面包屑"><template v-for="(item, index) in props.items" :key="`${item}-${index}`"><span v-if="index > 0" aria-hidden="true">/</span><span v-if="index === props.items.length - 1" aria-current="page" data-typography-role="subtitle-m">{{ item }}</span><a v-else :href="`#${item}`" data-typography-role="body-l" @click.prevent="emit('navigate', item)">{{ item }}</a></template></nav></template>
