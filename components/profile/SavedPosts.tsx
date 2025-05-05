"use client";
export const dynamic = "force-dynamic";

import PostCard from "@/components/post/PostCard";
import { useEffect, useState } from "react";
import { PostType } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "../Loader";

export default function SavedPosts() {
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
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="md:p-8 flex flex-col items-start">
      <h1 className="text-2xl font-bold text-black mb-4">Saved Posts</h1>
      <div className="flex flex-col gap-6 w-full">
        {bookmarkedPosts.map((post) => (
          <PostCard
            key={post.id}
            postData={post}
            onDelete={(id) =>
              setBookmarkedPosts((prev) => prev.filter((p) => p.id !== id))
            }
          />
        ))}
        {bookmarkedPosts.length === 0 && <p>You have no saved posts.</p>}
      </div>
    </div>
  );
}
