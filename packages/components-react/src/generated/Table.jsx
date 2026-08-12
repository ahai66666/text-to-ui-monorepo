import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Table({ label = "项目表格", description = "名称 / 类型 / 更新时间", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "名称 / 类型 / 更新时间";
  return (
    <div className="tui-generated tui-generated--table" data-component="table" data-logical-component="Table/Default" data-variant="default" data-state="default" data-framework="react"><div className="tui-generated__heading"><span data-slot="title" data-typography-role="title-s">项目表格</span><span data-slot="description" data-typography-role="body-m">名称 / 类型 / 更新时间</span></div><table><thead><tr><th data-typography-role="body-m">名称</th><th data-typography-role="body-m">负责人</th><th data-typography-role="body-m">状态</th></tr></thead><tbody><tr><td data-slot="content" data-typography-role="body-l">客户端设计系统</td><td data-typography-role="body-l">赵博海</td><td data-typography-role="body-l"><span className="tui-generated__badge" data-typography-role="caption-l">进行中</span></td></tr><tr><td data-typography-role="body-l">组件规范</td><td data-typography-role="body-l">林晓</td><td data-typography-role="body-l">已完成</td></tr></tbody></table></div>
  );
}

export default Table;
