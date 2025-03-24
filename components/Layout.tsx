"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { userAtom } from "@/atoms/user/atom";
import { useAtom } from "jotai";
import { get } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [, setUserData] = useAtom(userAtom);

  useEffect(() => {
    // read the token only once on mount
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const data = await get("/api/member/me");

        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchData();
  }, [i18n.language, setUserData]);

  return (
    <div className={` antialiased min-h-screen flex flex-col p-12`}>
      <main className="flex-grow" style={{ backgroundColor: "#ffffff" }}>
        {children}
      </main>
    </div>
  );
}
