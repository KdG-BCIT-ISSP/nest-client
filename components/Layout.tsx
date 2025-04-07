"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef } from "react";
import { userAtom } from "@/atoms/user/atom";

import { useAtom } from "jotai";
import { get } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import { announcementAtom } from "@/atoms/announcement/atom";

export default function Layout({ children }: { children: React.ReactNode }) {
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

        eventSource.onopen = () => {
          console.log("SSE connection opened");
        };

        eventSource.addEventListener(
          "new-notification",
          (event: MessageEvent) => {
            const notificationData = JSON.parse(event.data);
            console.log("New notification:", notificationData);

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
        console.log("SSE connection closed");
      }
    };
  }, [i18n.language, setUserData, setAnnouncementState]);

  return (
    <div className="antialiased min-h-screen flex flex-col p-12">
      <main className="flex-grow" style={{ backgroundColor: "#ffffff" }}>
        {children}
      </main>
    </div>
  );
}
