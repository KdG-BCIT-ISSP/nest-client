import { ReactNode } from "react";

export type ButtonProps = {
  label?: string;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
};
