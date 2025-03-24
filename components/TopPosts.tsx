"use client";

import { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import PostCard from "@/components/PostCard";
import { get } from "@/app/lib/fetchInterceptor";

export default function TopPosts({
  limit = 3,
  sortBy,
  title,
}: {
  limit?: number;
  sortBy?: keyof PostType;
  title: string;
}) {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [topPosts, setTopPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const posts = await get("/api/posts");
        setAllPosts(posts); // Stores all posts in state
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (allPosts.length > 0 && sortBy) {
      const sortedPosts = [...allPosts]
        .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
        .slice(0, limit);
      setTopPosts(sortedPosts);
    }
  }, [allPosts, limit, sortBy]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid gap-4">
        {topPosts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onDelete={(id) =>
              setTopPosts((prev) => prev.filter((p) => p.id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
