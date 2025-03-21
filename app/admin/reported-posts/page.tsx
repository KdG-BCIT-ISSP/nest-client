"use client";

import { getPostReports } from "@/app/api/report/post/getAll/route";
import { getPost } from "@/app/api/post/get/route";
import ReportCard from "@/components/ReportCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";

export default function ReportedPostsPage() {
  const [loading, setLoading] = useState(true);
  const [reportedPosts, setReportedPosts] = useState<Report[]>([]);
  const [posts, setPosts] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reportedPostsData, postsData] = await Promise.all([
          getPostReports(),
          getPost(),
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
    <div className="p-4 sm:ml-64">
      <SideMenu admin />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4 pb-4">
          Reported Posts
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
              <ReportCard
                key={post.id}
                post={post}
                reports={associatedReports}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
