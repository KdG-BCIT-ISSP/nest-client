"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { userAtom } from "@/atoms/user/atom";
import { useAtom } from "jotai";
import { getProfile } from "@/app/api/member/get/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [, setUserData] = useAtom(userAtom);

  useEffect(() => {
    // read the token only once on mount
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const data = await getProfile();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchData();
  }, [setUserData]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col p-12`}
    >
      <main className="flex-grow" style={{ backgroundColor: "#ffffff" }}>
        {children}
      </main>
    </div>
  );
}
