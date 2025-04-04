"use client";
export const dynamic = "force-dynamic";

import ReportCard from "@/components/admin/ReportCard";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "../Loader";

export default function ReportedCommentsComponent() {
  const [loading, setLoading] = useState(true);
  const [reportedComments, setReportedComments] = useState<Report[]>([]);
  const [comments, setComments] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [reportedPostsData, postsData] = await Promise.all([
          get("/api/report/comment"),
          get("/api/article"),
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
    return <Loader />;
  }

  const commentsWithReports = comments.filter((comment) =>
    reportedComments.some((report) => report.commentId === comment.id)
  );

  return (
    <div className="p-4">
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
  );
}
