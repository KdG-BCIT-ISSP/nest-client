"use client";

import { useEffect, useState } from "react";
import { getPost } from "@/app/api/post/get/route";
import { PostType } from "@/types/PostType";
import PostCard from "@/components/PostCard";
import HeroSection from "@/components/HeroSection";

export default function PostsPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
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

  const handleDelete = (id: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <HeroSection
        img={"/images/mom_and_baby.png"}
        title="Community posts"
        subtitle="This platform offers a supportive community for new mothers to share experiences, access helpful tips, and find guidance throughout their motherhood journey."
        direction="left"
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => (
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
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
