import { PopupWindowProps } from "@/types/PopupWindowProp";
import { CircleXIcon } from "lucide-react";
import React from "react";

export default function PopupWindow({
  title,
  submitButtonText,
  deleteButton,
  descriptionInput,
  onSubmit,
  onDelete,
  onClose,
  titleValue,
  descriptionValue,
  onTitleChange,
  onDescriptionChange,
}: PopupWindowProps) {
  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
    >
      <div className="relative p-4 w-full max-w-md max-h-full justify-center items-center mx-auto">
        <div className="relative bg-white rounded-lg shadow-sm">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-hide="popup-modal"
            onClick={onClose}
          >
            <CircleXIcon />
          </button>
          <div className="p-4 md:p-5">
            <h3 className="mb-5 text-lg font-normal text-gray-500">{title}</h3>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
              value={titleValue}
              onChange={(e) => onTitleChange(e)}
              required
            />
            {descriptionInput && (
              <textarea
                name="description"
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-40"
                value={descriptionValue}
                onChange={(e) => onDescriptionChange?.(e)}
                required
              />
            )}
            <div
              className={`flex ${deleteButton ? "justify-between" : "justify-end"} w-full mt-5`}
            >
              {deleteButton && (
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-secondary rounded-md border border-gray-200 hover:bg-secondaryPressed"
                onClick={onSubmit}
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
