"use client";
export const dynamic = "force-dynamic";

import Layout from "@/components/Layout";
import Providers from "./providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        style={{
          backgroundColor: "transparent",
          paddingTop: 20,
        }}
      >
        <Providers>
          <Navbar />
          <Layout>{children}</Layout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
