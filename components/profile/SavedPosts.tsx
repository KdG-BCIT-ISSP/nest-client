"use client";
export const dynamic = "force-dynamic";

import PostCard from "@/components/post/PostCard";
import { useEffect, useState } from "react";
import { PostType } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import { formatDate } from "@/utils/formatDate";

export default function SavedPosts() {
  const { t } = useTranslation("post");
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarkedPosts() {
      try {
        const data = await get("/api/content/post/bookmark");
        setBookmarkedPosts(data);
      } catch (err) {
        console.error("Failed to fetch bookmarked posts:", err);
        setError("Failed to fetch bookmarked posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarkedPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pl-0 p-8 flex flex-col items-start">
      <h1 className="text-2xl font-bold text-black mb-4">Saved Posts</h1>
      <div className="flex flex-col gap-6 w-full">
        {bookmarkedPosts.map((post) => (
          <PostCard
            key={post.id}
            className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
            {...post}
            author={post.memberUsername || t("post.anonymous")}
            createdAt={
              formatDate(post.createdAt ?? "") || t("post.unknownDate")
            }
          />
        ))}
        {bookmarkedPosts.length === 0 && <p>You have no saved posts.</p>}
      </div>
    </div>
  );
}
