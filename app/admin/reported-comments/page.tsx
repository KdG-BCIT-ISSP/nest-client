"use client";

import { getArticleReports } from "@/app/api/report/article/getAll/route";
import { getArticle } from "@/app/api/article/get/route";
import ReportCard from "@/components/ReportCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";

export default function ReportedCommentsPage() {
  const [loading, setLoading] = useState(true);
  const [reportedComments, setReportedComments] = useState<Report[]>([]);
  const [comments, setComments] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reportedPostsData, postsData] = await Promise.all([
          getArticleReports(),
          getArticle(),
        ]);
        setReportedComments(reportedPostsData);
        setComments(postsData);
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

  const commentsWithReports = comments.filter((comment) =>
    reportedComments.some((report) => report.commentId === comment.id)
  );

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu admin />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4 pb-4">
          Reported Comments
        </h1>
        {commentsWithReports.length === 0 && (
          <div className="text-gray-500">No reported comments</div>
        )}
        <div className="flex flex-col gap-6 w-full">
          {commentsWithReports.map((comment) => {
            const associatedReports = reportedComments.filter(
              (report) => report.commentId === comment.id
            );
            return (
              <ReportCard
                key={comment.id}
                post={comment}
                reports={associatedReports}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
