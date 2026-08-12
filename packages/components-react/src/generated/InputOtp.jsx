import React, { useState } from "react";
import { Icon, contract } from "../shared.jsx";
import "../styles.css";

export function InputOtp({ label = "验证码", description = "••••••", state = "default", children, ...props }) {
  const [open, setOpen] = useState(false);
  const content = children ?? "••••••";
  return (
    <section className="tui-generated tui-generated--card" data-component="input-otp" data-logical-component="Input OTP/Default" data-variant="default" data-state="default" data-framework="react"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">验证码</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">••••••</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="caption-l">辅助说明</small></span></section>
  );
}

export default InputOtp;
