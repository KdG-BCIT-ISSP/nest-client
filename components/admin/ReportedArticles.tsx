"use client";
export const dynamic = "force-dynamic";

import ReportCard from "@/components/ReportCard";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";

export default function ReportedArticlesComponent() {
  const [loading, setLoading] = useState(true);
  const [reportedPosts, setReportedPosts] = useState<Report[]>([]);
  const [posts, setPosts] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reportedPostsData, postsData] = await Promise.all([
          get("/api/report/article"),
          get("/api/article"),
        ]);
        setReportedPosts(reportedPostsData);
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
    return <div>Loading...</div>;
  }

  const postsWithReports = posts.filter((post) =>
    reportedPosts.some((report) => report.postId === post.id)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black mb-4 pb-4">
        Reported Articles
      </h1>
      {postsWithReports.length === 0 && (
        <div className="text-gray-500">No reported posts</div>
      )}
      <div className="flex flex-col gap-6 w-full">
        {postsWithReports.map((post) => {
          const associatedReports = reportedPosts.filter(
            (report) => report.postId === post.id
          );
          return (
            <ReportCard key={post.id} post={post} reports={associatedReports} />
          );
        })}
      </div>
    </div>
  );
}
