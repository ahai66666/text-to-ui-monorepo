import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function Tabs({ label = "概览  项目  成员", description = "项目", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "项目";
  return (
    <div className="tui-generated tui-generated--tabs" data-component="tabs" data-logical-component="Tabs/Default" data-variant="default" data-state="default" data-framework="react" role="tablist"><button className="tui-generated__tab is-selected" role="tab" aria-selected={true} data-typography-role="body-m">概览</button><button className="tui-generated__tab" role="tab" aria-selected={false} data-typography-role="body-m">项目</button><button className="tui-generated__tab" role="tab" aria-selected={false} data-typography-role="body-m">成员</button><div className="tui-generated__tab-panel" role="tabpanel" data-slot="content" data-typography-role="body-m">项目</div></div>
  );
}

export default Tabs;
