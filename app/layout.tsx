import type { Metadata } from "next";
import Layout from "@/components/Layout";
import JotaiProvider from "./providers/JotaiProvider";
import "./globals.css";

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
      <body>
        <JotaiProvider>
          <Layout>{children}</Layout>
        </JotaiProvider>
      </body>
    </html>
  );
}
