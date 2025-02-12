"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInitAuth } from "@/hooks/useAuth";

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
