"use client";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <h1 className="text-2xl font-bold mb-4">Notification Page</h1>
    </div>
  );
}
