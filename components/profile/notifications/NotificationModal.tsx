"use client";

import React from "react";
import { useTranslation } from "next-i18next";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    userName: string;
    message: string;
    timestamp: string | null;
    announcement: boolean;
    read: boolean;
  } | null;
}

export default function NotificationModal({
  isOpen,
  onClose,
  notification,
}: NotificationModalProps) {
  const { t } = useTranslation("common");

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {notification.announcement
            ? t("notifications.announcement")
            : t("notifications.detail")}
        </h2>
        <p className="mb-2">
          <strong>{t("notifications.message")}:</strong> {notification.message}
        </p>
        <p className="mb-2">
          <strong>{t("notifications.from")}:</strong> {notification.userName}
        </p>
        <p className="mb-2">
          <strong>{t("notifications.timestamp")}:</strong>{" "}
          {notification.timestamp
            ? new Date(notification.timestamp).toLocaleString()
            : "No timestamp available"}
        </p>
        <p className="mb-4">
          <strong>{t("notifications.status")}:</strong>{" "}
          {notification.read
            ? t("notifications.read")
            : t("notifications.unread")}
        </p>
        <button
          onClick={onClose}
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {t("notifications.close")}
        </button>
      </div>
    </div>
  );
}
