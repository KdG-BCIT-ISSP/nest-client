"use client";
import PostCard from "@/components/PostCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";
import { getPost } from "@/app/api/post/get/route";
import { PostType } from "@/types/PostType";

export default function SavedPostsPage() {
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

  // Filter posts to only include only those with memberID
  const filteredPosts = posts.filter((post) => post.memberId === 21);

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4">Saved Posts</h1>
        <div className="flex flex-col gap-6 w-full">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
              {...post}
            />
          ))}
          {filteredPosts.length === 0 && <p>You have no saved posts.</p>}
        </div>
      </div>
    </div>
  );
}
