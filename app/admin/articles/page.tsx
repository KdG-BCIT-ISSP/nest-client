"use client";

import { useEffect, useState } from "react";
import SideMenu from "@/components/SideMenu";
import TopArticles from "@/components/TopArticles";

export default function AdminArticlesPage() {
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
        <h1 className="text-2xl font-bold mb-4">Top Articles Page</h1>
        <TopArticles limit={5} sortBy="viewCount" title="Top Articles" />
      </div>
    </div>
  );
}
