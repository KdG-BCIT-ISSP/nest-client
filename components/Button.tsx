import React from "react";
import { ButtonProps } from "@/types/ButtonProps";

export default function Button({
  label,
  onClick,
  className = "",
  children,
  type = "button",
}: ButtonProps) {
  return (
    <button className={className} onClick={onClick} type={type}>
      {children || label}
    </button>
  );
}
