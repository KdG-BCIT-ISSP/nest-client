"use client";
export const dynamic = "force-dynamic";

import { get, post, put } from "@/app/lib/fetchInterceptor";
import { userAtom } from "@/atoms/user/atom";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import React from "react";
import NotificationModal from "./NotificationModal";

export default function NotificationSection({
  hasNewNotification,
  onViewed,
}: {
  hasNewNotification: boolean;
  onViewed: () => void;
}) {
  const { t } = useTranslation("common");
  const [userData] = useAtom(userAtom);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState<
    {
      id: number;
      userName: string;
      message: string;
      timestamp: string;
      announcement: boolean;
      read: boolean;
    }[]
  >([]);
  const [selectedNotification, setSelectedNotification] = useState<{
    id: number;
    userName: string;
    message: string;
    timestamp: string;
    announcement: boolean;
    read: boolean;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const truncateMessage = (message?: string) => {
    if (!message || typeof message !== "string") return "No message available";
    const words = message.split(" ");
    if (words.length > 5) {
      return words.slice(0, 5).join(" ") + "...";
    }
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  };

  const fetchNotifications = async (page: number) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await get(
        `/api/notification?page=${page}&size=${pageSize}&sort=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.content || [];
      setNotifications(data);
      setTotalPages(response.page?.totalPages || 1); // Access totalPages from page object
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const mockNotifications = [
        {
          id: 1,
          userName: "mock_user",
          message: "System update scheduled",
          timestamp: "2025-04-02T10:00:00Z",
          announcement: false,
          read: false,
        },
        {
          id: 2,
          userName: "mock_user",
          message: "New feature released",
          timestamp: "2025-04-01T15:00:00Z",
          announcement: false,
          read: false,
        },
      ];
      setNotifications(mockNotifications);
      setTotalPages(1);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim() || userData?.role !== "ADMIN") return;

    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await post(
        "/api/notification/announcement/send",
        { message: notificationMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newNotification = response;
      setNotifications((prev) => [newNotification, ...prev]);
      setNotificationMessage("");
      await fetchNotifications(currentPage);
    } catch (error) {
      console.error("Error sending announcement:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const response = await put(
        `/api/notification/read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification({ ...selectedNotification, read: true });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: {
    id: number;
    userName: string;
    message: string;
    timestamp: string;
    announcement: boolean;
    read: boolean;
  }) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchNotifications(currentPage);
    }
  }, [userData, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i ? "bg-secondary text-white" : "bg-gray-200"}`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pl-0 p-8 flex flex-col">
      <h1 className="text-2xl font-bold text-black mb-4">
        {t("navigation.notifications")}
      </h1>

      {userData?.role === "ADMIN" && (
        <div
          className="mb-6 p-4 border rounded-lg bg-gray-50"
          data-testid="send-notification-section"
        >
          <h2 className="text-lg font-semibold mb-2">
            {t("notifications.sendNotification")}
          </h2>
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder={t("notifications.typeMessage")}
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          <button
            onClick={handleSendNotification}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!notificationMessage.trim()}
          >
            {t("notifications.send")}
          </button>
        </div>
      )}

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          {t("notifications.recent")}
        </h2>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-2 bg-white border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleNotificationClick(notification)}
              >
                <p>{truncateMessage(notification.message)}</p>
                <span className="text-sm text-gray-500">
                  {notification.timestamp
                    ? new Date(notification.timestamp).toLocaleString()
                    : "No timestamp available"}
                </span>
                {notification.announcement && (
                  <span className="text-sm text-blue-500 ml-2">
                    [Announcement]
                  </span>
                )}
                <span className="text-sm text-gray-500 ml-2">
                  {notification.read ? "[Read]" : "[Unread]"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t("notifications.noNotifications")}</p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {t("notifications.prev")}
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {t("notifications.next")}
            </button>
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </div>
  );
}
