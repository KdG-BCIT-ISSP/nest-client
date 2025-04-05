"use client";
export const dynamic = "force-dynamic";

import PostCard from "@/components/post/PostCard";
import { useEffect, useState } from "react";
import { PostType } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";

export default function MyPosts() {
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userData] = useAtom(userAtom);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const data = await get(`/api/posts/${userData.userId}`);
        setMyPosts(data);
      } catch (err) {
        console.error("Failed to fetch my posts:", err);
        setError("Failed to fetch my posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyPosts();
  }, [userData.userId]);

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
        {myPosts.map((post) => (
          <PostCard
            key={post.id}
            postData={post}
            onDelete={(id) =>
              setMyPosts((prev) => prev.filter((p) => p.id !== id))
            }
          />
        ))}
        {myPosts.length === 0 && <p>You have not created any posts.</p>}
      </div>
    </div>
  );
}
