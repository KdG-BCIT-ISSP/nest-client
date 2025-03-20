import { ReactNode } from "react";

export type PopupWindowProps = {
  title: string;
  submitButtonText: string;
  deleteButton: boolean;
  descriptionInput: boolean;
  onSubmit?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => void;
  onDelete?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => void;
  onClose?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => void;
  titleValue: string;
  descriptionValue: string;
  onInputChange: (value: string) => void;
};
