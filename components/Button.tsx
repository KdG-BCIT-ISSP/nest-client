import React, { ReactNode } from "react";

type ButtonProps = {
  label?: string;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
};

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
