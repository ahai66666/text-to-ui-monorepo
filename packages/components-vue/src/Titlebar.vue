<script setup>
import "./styles.css";
import Icon from "./Icon.js";
import Button from "./Button.vue";
const defaultTitlebarLogoSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%230A59F7'/%3E%3Ctext x='12' y='17' text-anchor='middle' font-family='Arial,sans-serif' font-size='14' font-weight='700' fill='white'%3ET%3C/text%3E%3C/svg%3E";
const props = defineProps({ label: { type: String, default: "项目空间" }, paneTitle: { type: String, default: "项目内容" }, size: { type: String, default: "large" }, state: { type: String, default: "default" }, layout: { type: String, default: "standalone" }, paneRole: { type: String, default: "global" }, disabled: Boolean, mainDetailActions: { type: Array, default: () => [] }, logoSrc: { type: String, default: defaultTitlebarLogoSrc }, logoAlt: { type: String, default: "" } });
const emit = defineEmits(["action", "main-detail-action"]);
const actions = [["minimize", "最小化"], ["maximize", "最大化"], ["close", "关闭"]];
const titlebarActionType = (action) => {
  const type = action.buttonType ?? (action.showLabel ? "icon-text-ghost" : "icon");
  if (!["icon", "icon-text-ghost"].includes(type)) throw new Error(`Titlebar main-detail-actions only accepts icon or icon-text-ghost; received ${type}`);
  return type;
};
</script>
<template>
  <header class="tui-component tui-titlebar" data-component="titlebar" data-logical-component="Titlebar/Default" :data-variant="size" :data-size="size" :data-state="disabled ? 'disabled' : state" :data-layout="layout" :data-pane-role="paneRole" data-framework="vue">
    <span v-if="paneRole === 'global' || paneRole === 'primary-navigation'" class="tui-titlebar__brand" data-slot="leading"><img class="tui-titlebar__logo" :src="props.logoSrc" :alt="props.logoAlt" :aria-hidden="props.logoAlt ? undefined : 'true'" /><span data-slot="label" data-typography-role="subtitle-m">{{ props.label }}</span></span>
    <strong v-if="layout === 'two-column' && paneRole === 'final-pane'" class="tui-titlebar__pane-title" data-slot="main-content-title" data-action-scope="main-content-pane-global" data-typography-role="title-s">{{ props.paneTitle }}</strong>
    <div v-if="layout === 'three-column' && paneRole === 'final-pane' && props.mainDetailActions.length" class="tui-titlebar__pane-actions" data-slot="main-detail-actions" data-action-scope="main-detail-pane-global" aria-label="Main Detail 栏级操作"><Button v-for="action in props.mainDetailActions" :key="action.id" :label="action.label" variant="ghost" :mode="titlebarActionType(action) === 'icon' ? 'icon' : 'icon-text'" :logical-name="titlebarActionType(action) === 'icon' ? 'Icon Button/Ghost/Default' : 'Icon Text Button/Ghost/Default'" :icon="action.icon || 'action/more'" :class="`tui-titlebar__pane-action${titlebarActionType(action) === 'icon' ? '' : ' tui-titlebar__pane-action--text'}`" type="button" data-slot="main-detail-action" :data-action="action.id" :data-button-type="titlebarActionType(action)" :aria-label="action.label" :disabled="disabled || action.disabled" @click="emit('main-detail-action', action.id)" /></div>
    <div v-if="paneRole === 'global' || paneRole === 'final-pane'" class="tui-titlebar__actions" data-slot="actions"><button v-for="[action, text] in actions" :key="action" class="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" :data-action="action" data-button-type="icon" :aria-label="text" :disabled="disabled" @click="emit('action', action)"><Icon :name="`window/${action}`" :size="size === 'small' ? 16 : 24" /></button></div>
  </header>
</template>
