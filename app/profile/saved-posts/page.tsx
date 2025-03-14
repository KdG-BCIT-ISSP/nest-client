"use client";
import PostCard from "@/components/PostCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";
import { PostType } from "@/types/PostType";
import { getPostBookmarks } from "@/app/api/bookmark/post/get/route";

export default function SavedPostsPage() {
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarkedPosts() {
      try {
        const data = await getPostBookmarks();
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
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4">Saved Posts</h1>
        <div className="flex flex-col gap-6 w-full">
          {bookmarkedPosts.map((post) => (
            <PostCard
              key={post.id}
              className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
              {...post}
            />
          ))}
          {bookmarkedPosts.length === 0 && <p>You have no saved posts.</p>}
        </div>
      </div>
    </div>
  );
}
