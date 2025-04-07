"use client";
export const dynamic = "force-dynamic";

import ReportCard from "@/components/admin/ReportCard";
import { useEffect, useState } from "react";
import { ReportPostType, Report } from "@/types/PostType";
import { get } from "@/app/lib/fetchInterceptor";
import { decodeAndTruncateHtml } from "@/utils/cleanHtml";
import Loader from "../Loader";

export default function ReportedArticlesComponent() {
  const [loading, setLoading] = useState(true);
  const [reportedArticles, setReportedArticles] = useState<Report[]>([]);
  const [articles, setArticles] = useState<ReportPostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const reportedArticlesData = await get("/report/article");
        setReportedArticles(reportedArticlesData);

        const uniqueArticleIds = Array.from(
          new Set(reportedArticlesData.map((report: Report) => report.postId))
        ) as number[];

        const articlesData = await Promise.all(
          uniqueArticleIds.map((articleId: number) =>
            get(`/content/id/${articleId}`)
          )
        );

        const cleanedArticles = articlesData.map((article: ReportPostType) => ({
          ...article,
          content: decodeAndTruncateHtml(article.content),
        }));

        setArticles(cleanedArticles);
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
        Reported Articles
      </h1>
      {articles.length === 0 && (
        <div className="text-gray-500">No reported articles</div>
      )}
      <div className="flex flex-col gap-6 w-full">
        {articles.map((article: ReportPostType) => {
          const associatedReports = reportedArticles.filter(
            (report) => report.postId === article.id
          );
          return (
            <ReportCard
              key={article.id}
              post={article}
              reports={associatedReports}
            />
          );
        })}
      </div>
    </div>
  );
}
