import { ReactNode } from "react";

export type PopupWindowProps = {
    windowId: string;
    title: string;
    submitButtonText: string;
    deleteButton: boolean;
    onClick?: (
        event:
            | React.MouseEvent<HTMLButtonElement>
            | React.FormEvent<HTMLFormElement>
    ) => void;
    className?: string;
};
