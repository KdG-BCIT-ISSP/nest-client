"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";
import TopArticles from "@/components/TopArticles";

export default function AdminArticlesPage() {
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
