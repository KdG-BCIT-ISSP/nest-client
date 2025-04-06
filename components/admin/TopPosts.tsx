"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import PostCard from "../post/PostCard";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "../Loader";

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

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const posts = await get(
          `/api/posts?page=${currentPage}&size=${pageSize}`
        );
        setAllPosts(posts.content);
        setTotalPages(posts.page.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    if (allPosts.length > 0 && sortBy) {
      const sortedPosts = [...allPosts]
        .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
        .slice(0, limit);
      setTopPosts(sortedPosts);
    }
  }, [allPosts, limit, sortBy]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid gap-4">
        {topPosts.map((post) => (
          <PostCard
            key={post.id}
            postData={post}
            onDelete={(id) =>
              setTopPosts((prev) => prev.filter((p) => p.id !== id))
            }
          />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
