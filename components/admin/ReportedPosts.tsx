"use client";
export const dynamic = "force-dynamic";

import ReportCard from "@/components/admin/ReportCard";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "../Loader";

export default function ReportedPostsComponent() {
  const [loading, setLoading] = useState(true);
  const [reportedPosts, setReportedPosts] = useState<Report[]>([]);
  const [posts, setPosts] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const reportedPostsData = await get("/report/post");
        setReportedPosts(reportedPostsData);

        const uniquePostIds = Array.from(
          new Set(reportedPostsData.map((report: Report) => report.postId))
        ) as number[];

        const postsData = await Promise.all(
          uniquePostIds.map((postId) => get(`/content/id/${postId}`))
        );
        setPosts(postsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black mb-4 pb-4">
        Reported Posts
      </h1>
      {posts.length === 0 && (
        <div className="text-gray-500">No reported posts</div>
      )}
      <div className="flex flex-col gap-6 w-full">
        {posts.map((post: ReportPostType) => {
          const associatedReports = reportedPosts.filter(
            (report) => report.postId === post.id
          );
          return (
            <ReportCard
              key={post.id}
              post={post}
              reports={associatedReports}
              isPost
            />
          );
        })}
      </div>
    </div>
  );
}
