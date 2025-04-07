"use client";

import { useEffect, useRef } from "react";
import { userAtom } from "@/atoms/user/atom";

import { useAtom } from "jotai";
import { get } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import { announcementAtom } from "@/atoms/announcement/atom";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const [, setUserData] = useAtom(userAtom);
  const [, setAnnouncementState] = useAtom(announcementAtom); // Use announcementAtom
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const userData = await get("/api/member/me");
        setUserData(userData);

        const eventSource = get("/api/notification/subscribe", {
          useEventSource: true,
        }) as EventSource;

        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {};

        eventSource.addEventListener(
          "new-notification",
          (event: MessageEvent) => {
            const notificationData = JSON.parse(event.data);

            if (notificationData.announcement) {
              setAnnouncementState((prev) => ({
                ...prev,
                newAnnouncement: true,
              }));
            }
          }
        );

        eventSource.onerror = (error) => {
          console.error("SSE error:", error);
        };
      } catch (error) {
        console.error("Failed to fetch profile data or subscribe:", error);
      }
    };

    fetchData();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [i18n.language, setUserData, setAnnouncementState]);

  return (
    <div className="antialiased min-h-screen flex flex-col p-12">
      <main className="flex-grow bg-white">{children}</main>
    </div>
  );
}
