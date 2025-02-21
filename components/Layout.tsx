"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInitAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isAuthenticatedAtom } from "@/atoms/auth/atom";
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
  useInitAuth();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserData] = useAtom(userAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, setUserData]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen flex flex-col`}
    >
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
