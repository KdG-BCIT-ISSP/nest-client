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
      setTotalPages(response.page?.totalPages || 1);
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
      await put(
        `/api/notification/read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    if (hasNewNotification) {
      onViewed();
    }
  }, [hasNewNotification, onViewed]);

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
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i ? "bg-secondary text-white" : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center justify-between">
        {t("navigation.notifications")}
        {hasNewNotification && (
          <span className="text-base text-red-500">New</span>
        )}
      </h1>

      {userData?.role === "ADMIN" && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">
            {t("notifications.sendNotification")}
          </h2>
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder={t("notifications.typeMessage")}
            className="w-full p-2 border rounded mb-3"
            rows={4}
          />
          <button
            onClick={handleSendNotification}
            disabled={!notificationMessage.trim()}
            className="px-5 py-2 bg-secondary text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {t("notifications.send")}
          </button>
        </div>
      )}

      {/* ── MOBILE VIEW ── */}
      <div className="sm:hidden bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <ul className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="flex items-start p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {n.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {n.userName}
                    </h3>
                    <time className="text-xs text-gray-500">
                      {new Date(n.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    {truncateMessage(n.message)}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    {n.announcement && (
                      <span className="inline-block px-2 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                        Announcement
                      </span>
                    )}
                    {n.read ? (
                      <span className="text-xs text-gray-500">Read</span>
                    ) : (
                      <span className="text-xs text-red-500">Unread</span>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              {t("notifications.noNotifications")}
            </li>
          )}
        </ul>
      </div>

      {/* ──WEB VIEW ── */}
      <div className="hidden sm:block bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.map((n) => (
              <tr
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {n.userName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {truncateMessage(n.message)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(n.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {n.announcement ? (
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800 rounded-full">
                      Announcement
                    </span>
                  ) : (
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 bg-gray-100 text-gray-800 rounded-full">
                      Info
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {n.read ? (
                    <span className="text-gray-500">Read</span>
                  ) : (
                    <span className="text-red-500">Unread</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ‹ Prev
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next ›
          </button>
        </div>
      )}

      <NotificationModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </div>
  );
}
