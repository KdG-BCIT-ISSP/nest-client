"use client";

import { useState, useEffect } from "react";
import { getPost } from "@/app/api/post/get/route";
import { PostType } from "@/types/PostType";
import PostCard from "@/components/PostCard";

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
        const posts = await getPost();
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
            id={post.id ?? 0}
            title={post.title}
            content={post.content}
            tags={post.tagNames}
            imageBase64={post.imageBase64}
            author={post.memberUsername}
            createdAt={post.createdAt}
            isBookmarked={post.bookmarked}
            isLiked={post.liked}
            likesCount={post.likesCount ?? 0}
            viewCount={post.viewCount ?? 0}
            shareCount={post.shareCount ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
