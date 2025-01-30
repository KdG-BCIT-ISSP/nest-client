import React from "react";
import { ButtonProps } from "@/types/ButtonProps";

export default function Button({
  label,
  onClick,
  className = "",
  children,
}: ButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {children || label}
    </button>
  );
}
