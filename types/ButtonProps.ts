import { ReactNode } from "react";

export type ButtonProps = {
  label?: string;
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => void;
  className?: string;
  children?: ReactNode;
};
