"use client";

import { useEffect, useState } from "react";
import { getPost } from "@/app/api/post/get/route";
import { PostType } from "@/types/PostType";
import PostCard from "@/components/PostCard";

export default function PostsPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPost();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Posts Page</h1>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
              {...post}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
