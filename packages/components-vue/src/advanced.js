import { Teleport, computed, defineComponent, h, nextTick, onBeforeUnmount, ref, watch } from "vue";
import "./styles.css";
import Icon from "./Icon.js";

const contract = (id, logicalName, variant = "default", state = "default") => ({ "data-component": id, "data-logical-component": logicalName, "data-variant": variant, "data-state": state, "data-framework": "vue" });
const text = (tag, value, role, props = {}) => h(tag, { ...props, "data-typography-role": role }, value);
const calendarWeekdays = ["日", "一", "二", "三", "四", "五", "六"];
const calendarDays = ["26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5"];

const DialogBase = defineComponent({
  props: {
    id: String, title: String, description: String, intent: { type: String, default: "default" }, actionLayout: { type: String, default: "double" },
    confirmLabel: { type: String, default: "确认" }, cancelLabel: { type: String, default: "取消" }, size: { type: String, default: "m" },
    surface: { type: String, default: "white" }, mode: { type: String, default: "modal" }, triggerLabel: { type: String, default: "打开弹窗" }, showClose: Boolean
  },
  emits: ["confirm", "cancel", "close", "update:open"],
  setup(props, { emit, slots }) {
    const open = ref(false); const trigger = ref(); const dialog = ref();
    const titleId = `${props.id}-${Math.random().toString(36).slice(2)}-title`; const descriptionId = `${props.id}-${Math.random().toString(36).slice(2)}-description`;
    const finish = (reason) => { open.value = false; emit("update:open", false); emit(reason); nextTick(() => trigger.value?.focus()); };
    const onKeydown = (event) => {
      if (!open.value) return;
      if (event.key === "Escape") { event.preventDefault(); finish("cancel"); return; }
      if (props.mode !== "modal" || event.key !== "Tab" || !dialog.value) return;
      const focusable = [...dialog.value.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) { event.preventDefault(); dialog.value.focus(); return; }
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeydown); onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
    watch(open, (value) => { if (value) nextTick(() => dialog.value?.focus()); });
    return () => h("div", { class: "tui-overlay-example" }, [
      h("button", { ref: trigger, class: "tui-button", type: "button", "data-variant": "secondary", "data-typography-role": "body-l", onClick: () => { open.value = true; emit("update:open", true); } }, props.triggerLabel),
      open.value ? h(Teleport, { to: "body" }, h("div", { class: "tui-overlay-layer", "data-size": props.size, "data-surface": props.surface, "data-mode": props.mode }, [
        h("div", { class: "tui-overlay-backdrop", "aria-hidden": "true" }),
        h("section", { ref: dialog, class: ["tui-component", "tui-dialog", props.id === "alert-dialog" && "tui-dialog--alert", props.id === "semi-modal" && "tui-dialog--semi"], ...contract(props.id, props.id === "alert-dialog" ? "Alert Dialog/Default" : props.id === "semi-modal" ? "Semi-modal/Default" : "Dialog/Default", `${props.size}-${props.surface}-${props.mode}`, "open"), role: props.id === "alert-dialog" ? "alertdialog" : "dialog", "aria-modal": props.mode === "modal", "aria-labelledby": titleId, "aria-describedby": descriptionId, tabindex: -1 }, [
          h("header", { class: "tui-dialog__header" }, [text("h4", props.title, "title-s", { id: titleId }), props.showClose ? h("button", { class: "tui-icon-button tui-dialog__close", type: "button", "aria-label": "关闭", onClick: () => finish("close") }, [h(Icon, { name: "action/close", size: 20 })]) : null]),
          h("div", { class: "tui-dialog__content" }, [text("p", props.description, "body-m", { id: descriptionId, "data-slot": "description" }), slots.default?.()]),
          h("footer", { class: "tui-dialog__actions", "data-action-layout": props.actionLayout }, props.actionLayout === "single"
            ? [h("button", { class: "tui-button", type: "button", "data-variant": props.intent === "danger" ? "danger" : "primary", "data-typography-role": "body-l", onClick: () => finish("confirm") }, props.confirmLabel)]
            : [h("button", { class: "tui-button", type: "button", "data-variant": "secondary", "data-typography-role": "body-l", onClick: () => finish("cancel") }, props.cancelLabel), h("button", { class: "tui-button", type: "button", "data-variant": props.intent === "danger" ? "danger" : "primary", "data-typography-role": "body-l", onClick: () => finish("confirm") }, props.confirmLabel)])
        ])
      ])) : null
    ]);
  }
});
export const Dialog = defineComponent({ props: { actionLayout: { type: String, default: "double" } }, emits: ["confirm", "cancel"], setup(props, { emit }) { return () => h(DialogBase, { id: "dialog", title: props.actionLayout === "single" ? "更新完成" : "确认更新？", description: props.actionLayout === "single" ? "应用已经更新到最新版本。" : "更新期间应用需要重新启动。", actionLayout: props.actionLayout, confirmLabel: props.actionLayout === "single" ? "知道了" : "确认", triggerLabel: props.actionLayout === "single" ? "打开单按钮对话弹窗" : "打开双按钮对话弹窗", onConfirm: () => emit("confirm"), onCancel: () => emit("cancel") }); } });
export const AlertDialog = defineComponent({ emits: ["confirm", "cancel"], setup(_, { emit }) { return () => h(DialogBase, { id: "alert-dialog", title: "删除项目？", description: "删除后无法恢复，请确认操作。", intent: "danger", actionLayout: "double", confirmLabel: "删除", triggerLabel: "打开删除确认弹窗", onConfirm: () => emit("confirm"), onCancel: () => emit("cancel") }); } });
export const SemiModal = defineComponent({ props: { size: { type: String, default: "m" }, surface: { type: String, default: "white" }, mode: { type: String, default: "non-modal" } }, emits: ["confirm", "cancel", "close"], setup(props, { emit }) { return () => h(DialogBase, { id: "semi-modal", title: "编辑项目设置", description: "非模态为默认状态，可以继续操作背景内容。", size: props.size, surface: props.surface, mode: props.mode, showClose: true, confirmLabel: "保存", triggerLabel: "打开半模态弹窗", onConfirm: () => emit("confirm"), onCancel: () => emit("cancel"), onClose: () => emit("close") }, { default: () => h("div", { class: "tui-dialog__form" }, [h("label", { class: "tui-field" }, [text("span", "项目名称", "body-m"), h("span", { class: "tui-input", "data-surface": props.surface }, [h("input", { value: "客户端设计系统", "data-typography-role": "body-l" })])]), h("label", { class: "tui-field" }, [text("span", "负责人", "body-m"), h("span", { class: "tui-search", "data-surface": props.surface }, [h(Icon, { name: "field/search", size: 20 }), h("input", { value: "赵博海", type: "search", "data-typography-role": "body-l" })])])]) }); } });

const Menu = defineComponent({
  props: { id: String, logicalName: String, label: String, value: String, items: Array },
  setup(props) {
    const open = ref(false); const selected = ref(props.value);
    return () => h("div", { class: "tui-component tui-advanced-menu", ...contract(props.id, props.logicalName, "default", open.value ? "open" : "default") }, [
      text("span", props.label, "body-m", { class: "tui-advanced-menu__label" }),
      h("button", { class: "tui-advanced-menu__trigger", type: "button", "aria-haspopup": "menu", "aria-expanded": open.value, onClick: () => { open.value = !open.value; } }, [text("span", selected.value, "body-l", { "data-slot": "value" }), h(Icon, { name: "navigation/chevron-down", size: 16 })]),
      h("div", { class: "tui-advanced-menu__panel", role: "menu", hidden: !open.value }, props.items.map((item) => { const entry = typeof item === "string" ? { label: item } : item; return h("button", { key: entry.label, class: "tui-advanced-menu__item", type: "button", role: "menuitem", "data-typography-role": "body-l", onClick: () => { selected.value = entry.label; open.value = false; } }, [entry.icon ? h(Icon, { name: entry.icon, size: 24 }) : null, h("span", entry.label)]); }))
    ]);
  }
});
export const NavigationMenu = defineComponent({ setup: () => () => h(Menu, { id: "navigation-menu", logicalName: "Navigation Menu/Default", label: "导航菜单", value: "项目 / 团队 / 设置", items: ["项目", "团队", "设置"] }) });
export const ContextMenu = defineComponent({ setup: () => () => h(Menu, { id: "context-menu", logicalName: "Context Menu/Default", label: "更多操作", value: "右键或点击打开", items: [{ label: "复制", icon: "action/copy" }, { label: "重命名", icon: "action/rename" }, { label: "删除", icon: "action/delete" }] }) });
export const DropdownMenu = defineComponent({ setup: () => () => h(Menu, { id: "dropdown-menu", logicalName: "Dropdown Menu/Default", label: "操作菜单", value: "新建、导入、导出", items: ["新建", "导入", "导出"] }) });
export const Menubar = defineComponent({ setup: () => () => h(Menu, { id: "menubar", logicalName: "Menubar/Default", label: "主菜单", value: "文件", items: ["新建", "打开", "导出"] }) });

export const Popover = defineComponent({ setup: () => { const open = ref(false); return () => h("div", { class: "tui-component tui-advanced-popover", ...contract("popover", "Popover/Default") }, [h("button", { class: "tui-button", type: "button", "data-variant": "ghost", "data-typography-role": "body-l", "aria-expanded": open.value, onClick: () => { open.value = !open.value; } }, "筛选条件"), h("div", { class: "tui-advanced-popover__panel", role: "dialog", hidden: !open.value }, [text("strong", "筛选条件", "title-s"), text("span", "状态、负责人、更新时间", "body-m")])]); } });
export const HoverCard = defineComponent({ setup: () => () => h("div", { class: "tui-component tui-advanced-hover-card", ...contract("hover-card", "Hover Card/Default") }, [h("button", { class: "tui-button", type: "button", "data-variant": "ghost", "data-typography-role": "body-l" }, "组件说明"), h("div", { class: "tui-advanced-hover-card__panel", role: "tooltip" }, [text("strong", "组件说明", "title-s"), text("span", "查看组件的详细使用规则", "body-m")])]) });

export const Slider = defineComponent({ props: { modelValue: { type: Number, default: 84 } }, emits: ["update:modelValue", "change"], setup(props, { emit }) { const value = ref(props.modelValue); return () => h("label", { class: "tui-component tui-slider", ...contract("slider", "Slider/Default") }, [text("span", "透明度", "body-m", { "data-slot": "label" }), h("input", { type: "range", min: 0, max: 100, value: value.value, "aria-label": "透明度", onInput: (event) => { value.value = Number(event.target.value); emit("update:modelValue", value.value); emit("change", value.value); } }), text("output", value.value, "body-m")]); } });
export const InputOtp = defineComponent({ props: { length: { type: Number, default: 6 } }, emits: ["complete"], setup(props, { emit }) { const values = ref(Array(props.length).fill("")); return () => h("fieldset", { class: "tui-component tui-input-otp", ...contract("input-otp", "Input OTP/Default") }, [text("legend", "验证码", "body-m"), h("div", { class: "tui-input-otp__cells" }, values.value.map((value, index) => h("input", { class: "tui-input-otp__cell", key: index, type: "text", inputmode: "numeric", maxlength: 1, value, "aria-label": `第 ${index + 1} 位验证码`, "data-typography-role": "body-l", onInput: (event) => { const next = [...values.value]; next[index] = event.target.value.slice(-1); values.value = next; if (next.every(Boolean)) emit("complete", next.join("")); } }))), text("small", "请输入 6 位验证码", "caption-l")]); } });
export const Kbd = defineComponent({ setup: () => () => h("kbd", { class: "tui-component tui-kbd", ...contract("kbd", "Kbd/Default"), "data-typography-role": "body-m" }, "⌘ K") });

export const Chart = defineComponent({ setup: () => () => h("figure", { class: "tui-component tui-chart", ...contract("chart", "Chart/Default") }, [text("figcaption", "项目趋势", "title-s"), h("svg", { class: "tui-chart__svg", viewBox: "0 0 240 96", role: "img", "aria-label": "项目趋势图" }, [h("path", { d: "M8 78L52 58L96 64L140 32L184 42L232 14", fill: "none", stroke: "currentColor", "stroke-width": 1.5 }), h("path", { d: "M8 80H232", fill: "none", stroke: "currentColor", "stroke-width": 1, opacity: .24 })]), text("span", "本周完成度 84%", "caption-l")]) });
export const Calendar = defineComponent({ setup: () => { const selected = ref("7"); return () => h("section", { class: "tui-component tui-calendar", ...contract("calendar", "Calendar/Default") }, [h("header", null, [text("strong", "2026 年 08 月", "title-s"), h("button", { class: "tui-icon-button", type: "button", "aria-label": "上个月" }, "‹"), h("button", { class: "tui-icon-button", type: "button", "aria-label": "下个月" }, "›")]), h("div", { class: "tui-calendar__week", "data-typography-role": "caption-l" }, calendarWeekdays.map((day) => text("span", day, "caption-l", { key: `week-${day}` }))), h("div", { class: "tui-calendar__days", role: "grid" }, calendarDays.map((day, index) => h("button", { key: `${day}-${index}`, type: "button", role: "gridcell", class: day === selected.value && index === 12 ? "is-selected" : "", onClick: () => { selected.value = day; } }, day)))]); } });

const Picker = defineComponent({ props: { id: String, logicalName: String, label: String, value: String, iconName: String }, setup(props, { slots }) { const open = ref(false); return () => h("div", { class: "tui-component tui-picker", ...contract(props.id, props.logicalName, "default", open.value ? "open" : "default") }, [text("label", props.label, "body-m"), h("button", { class: "tui-picker__trigger", type: "button", "aria-haspopup": "dialog", "aria-expanded": open.value, onClick: () => { open.value = !open.value; } }, [text("span", props.value, "body-l", { "data-slot": "value" }), h(Icon, { name: props.iconName, size: 20 })]), h("div", { class: "tui-picker__panel", role: "dialog", hidden: !open.value }, slots.default?.())]); } });
export const DatePicker = defineComponent({
  setup: () => {
    const value = ref("2026-08-07");
    return () => h(Picker, { id: "date-picker", logicalName: "Date Picker/Default", label: "日期", value: value.value, iconName: "field/calendar" }, {
      default: () => [
        h("div", { class: "tui-picker__calendar" }, [
          ...calendarWeekdays.map((d) => text("span", d, "caption-l", { key: `week-${d}` })),
          ...calendarDays.map((d, index) => h("button", { key: `day-${d}-${index}`, type: "button", role: "gridcell", class: d === "7" && index === 12 ? "is-selected" : "", onClick: () => { value.value = `2026-08-${d.padStart(2, "0")}`; } }, d))
        ]),
        h("footer", null, [
          h("button", { type: "button", "data-typography-role": "body-l", onClick: () => { value.value = ""; } }, "清除"),
          h("button", { type: "button", "data-typography-role": "body-l", onClick: () => { value.value = "2026-08-07"; } }, "今天")
        ])
      ]
    });
  }
});
export const TimePicker = defineComponent({
  setup: () => {
    const value = ref("09:30");
    return () => h(Picker, { id: "time-picker", logicalName: "Time Picker/Default", label: "时间", value: value.value, iconName: "field/clock" }, {
      default: () => [
        h("div", { class: "tui-picker__columns" }, [
          h("div", null, [text("span", "时", "caption-l"), ...["08", "09", "10"].map((d) => h("button", { key: `hour-${d}`, type: "button", class: d === "09" ? "is-selected" : "", onClick: () => { value.value = `${d}:${value.value.split(":")[1] ?? "30"}`; } }, d))]),
          h("b", null, ":"),
          h("div", null, [text("span", "分", "caption-l"), ...["25", "30", "35"].map((d) => h("button", { key: `minute-${d}`, type: "button", class: d === "30" ? "is-selected" : "", onClick: () => { value.value = `${value.value.split(":")[0] ?? "09"}:${d}`; } }, d))])
        ]),
        h("footer", null, [
          h("button", { type: "button", "data-typography-role": "body-l", onClick: () => { value.value = ""; } }, "清除"),
          h("button", { type: "button", "data-typography-role": "body-l" }, "确定")
        ])
      ]
    });
  }
});

export const Attachment = defineComponent({ emits: ["download"], setup(_, { emit }) { return () => h("article", { class: "tui-component tui-attachment", ...contract("attachment", "Attachment/Default") }, [text("span", "PDF", "caption-l", { class: "tui-attachment__type" }), h("div", null, [text("strong", "项目说明.pdf", "subtitle-s"), text("small", "2.4 MB · 已上传", "body-s")]), h("button", { class: "tui-icon-button tui-attachment__download", type: "button", "aria-label": "下载", onClick: () => emit("download") }, [h(Icon, { name: "action/download", size: 20 })])]); } });
export const Carousel = defineComponent({ setup: () => { const slide = ref(0); const items = ["HarmonyOS PC 组件规范", "项目协作动态", "设计 Token 资产"]; return () => h("section", { class: "tui-component tui-carousel", ...contract("carousel", "Carousel/Default"), "aria-roledescription": "carousel" }, [h("header", null, [text("strong", "项目概览", "title-s"), text("span", `${slide.value + 1} / 3`, "caption-l", { class: "tui-carousel__count" })]), text("div", items[slide.value], "body-l", { class: "tui-carousel__slide" }), h("footer", null, [h("button", { class: "tui-icon-button", type: "button", "aria-label": "上一项", onClick: () => { slide.value = (slide.value + 2) % 3; } }, "‹"), h("button", { class: "tui-icon-button", type: "button", "aria-label": "下一项", onClick: () => { slide.value = (slide.value + 1) % 3; } }, "›")])]); } });
