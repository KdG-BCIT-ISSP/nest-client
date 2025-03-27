"use client";
import React from "react";
import { useTranslation } from "next-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto ${className || ""}`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md"
          >
            {t("navigation.close")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
