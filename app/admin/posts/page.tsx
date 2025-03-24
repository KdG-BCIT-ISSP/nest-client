"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";
import TopPosts from "@/components/TopPosts";

export default function AdminPostPage() {
  return (
    <div className="flex">
      <SideMenu admin />
      <div className="p-4 sm:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-4">Top Posts Page</h1>
        <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
        <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
        <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
      </div>
    </div>
  );
}
