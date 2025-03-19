import { ReactNode } from "react";

export type PopupWindowProps = {
    title: string;
    content: string;
    submitButtonText: string;
    deleteButton: boolean;
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
    inputValue: string;
    onInputChange: (value: string) => void;
};
