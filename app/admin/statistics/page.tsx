"use client";

import { useEffect, useState } from "react";
import SideMenu from "@/components/SideMenu";

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <SideMenu admin />
      <div className="p-4 sm:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-4">Statistics Page</h1>
      </div>
    </div>
  );
}
