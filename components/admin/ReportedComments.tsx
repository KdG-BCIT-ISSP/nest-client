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
        const reportedCommentsData = await get("/report/comment");
        setReportedComments(reportedCommentsData);

        const uniqueContentIds = Array.from(
          new Set(
            reportedCommentsData.map((report: Report) => report.contentId)
          )
        ) as number[];

        const commentsData = await Promise.all(
          uniqueContentIds.map((id: number) => get(`/content/id/${id}`))
        );
        setComments(commentsData);
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
        Reported Comments
      </h1>
      {comments.length === 0 && (
        <div className="text-gray-500">No reported comments</div>
      )}
      <div className="flex flex-col gap-6 w-full">
        {comments.map((comment: ReportPostType) => {
          const associatedReports = reportedComments.filter(
            (report) => report.contentId === comment.id
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
