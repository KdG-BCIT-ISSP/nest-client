"use client";
import React from "react";
import { useTranslation } from "next-i18next";
import { Circle, CircleXIcon } from "lucide-react";

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
            className="text-secondary hover:text-secondaryPressed cursor-pointer"
          >
            {/* {t("navigation.close")} */}
            <CircleXIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
