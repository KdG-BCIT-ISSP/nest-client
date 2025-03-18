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
        const data = await getPost();

        const formattedPosts: PostType[] = data.map((post: PostType) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          topicId: post.topicId ?? 2,
          tagNames: Array.isArray(post.tagNames) ? post.tagNames : [],
          imageBase64: Array.isArray(post.imageBase64) ? post.imageBase64 : [],
          memberUsername: post.memberUsername || "Anonymous",
          timestamp: post.timestamp
            ? new Date(post.timestamp).toISOString()
            : new Date().toISOString(),
          bookmarked: post.bookmarked ?? false,
          liked: post.liked ?? false,
          type: post.type ?? "USERPOST",
        }));

        setPosts(formattedPosts);
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
              id={post.id}
              title={post.title}
              content={post.content}
              tags={post.tagNames ?? []}
              imageBase64={post.imageBase64}
              author={post.memberUsername}
              timestamp={new Date(
                post.timestamp ?? Date.now()
              ).toLocaleString()}
              isBookmarked={post.bookmarked}
              isLiked={post.liked}
              className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
