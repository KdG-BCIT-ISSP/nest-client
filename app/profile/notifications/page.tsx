"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <h1 className="text-2xl font-bold mb-4">Notification Page</h1>
    </div>
  );
}
