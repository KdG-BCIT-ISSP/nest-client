import type { Metadata } from "next";
import Layout from "@/components/Layout";
import Providers from "./providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NEST",
  description: "Nurturing Engagement & Support Toolkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
