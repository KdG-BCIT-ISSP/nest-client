"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { userAtom } from "@/atoms/user/atom";
import { useAtom } from "jotai";
import { getProfile } from "@/app/api/profile/get/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("accessToken");
  const [, setUserData] = useAtom(userAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, setUserData]);

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
