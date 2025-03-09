"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Back from "@/public/svg/Article/Back";
import Dots from "@/public/svg/Article/Dots";
import parse from "html-react-parser";
import Report from "@/public/svg/Article/Report";
import ArticleThumpsUp from "@/public/svg/Article/ThumbsUp";
import ArticleComment from "@/public/svg/Article/Comment";
import ArticleBookmark from "@/public/svg/Article/Bookmark";
import ArticleShare from "@/public/svg/Article/Share";
import Tags from "@/components/Tags";
import CommentsSection from "@/components/Comments";
import { getArticle } from "@/app/api/article/get/route";
import { ArticleType } from "@/types/ArticleType";
import { reportArticle } from "@/app/api/report/article/post/route";
import XIcon from "@/public/svg/XIcon";

export default function ArticleDetailsPage() {
  const params = useParams();
  const articleId = Number(params.articleId);
  const [article, setArticle] = useState<ArticleType>();
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const data = await getArticle();
        const foundArticle = data.find(
          (item: ArticleType) => item.id === articleId
        );
        if (foundArticle) {
          setArticle({
            ...foundArticle,
            content: decodeURIComponent(foundArticle.content),
          });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [articleId]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  const html = parse(article.content);

  const handleReportSubmit = async () => {
    if (!article || !article.id) return;
    try {
      await reportArticle(article.id, reportReason);
      alert("Reported successfully");
      setShowReport(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting article:", error);
    }
  };

  return (
    <div className="w-max mx-auto pt-10">
      <div className="flex justify-between items-center p-4">
        <button onClick={() => window.history.back()}>
          <Back />
        </button>
        <div className="relative">
          <button onClick={() => setShowReportButton((prev) => !prev)}>
            <Dots />
          </button>
          {showReportButton && (
            <div
              className="absolute right-0 mt-1 z-10 cursor-pointer"
              onClick={() => setShowReport((prev) => !prev)}
            >
              <Report />
            </div>
          )}
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-md w-1/4 flex space-between flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Submit a report</h1>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <XIcon />
              </button>
            </div>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter your reason for reporting this article..."
              className="w-full p-2 mb-4 border-none focus:outline-none focus:ring-0 bg-gray-200"
              rows={8}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-secondary font-bold text-white rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4 pt-4 text-black">
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            By <b>{article.memberUsername}</b> | {new Date().toLocaleString()}
          </p>

          <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
            {article.title}
          </h1>

          <Tags tagsList={article.tagNames} />

          <div className="relative w-full h-[400px] rounded-t-lg md:rounded-none overflow-hidden">
            <Image
              src={article.coverImage}
              alt="Article cover image"
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
          </div>
        </div>
        <hr className="border-gray-600 p-4" />

        <div className="prose prose-green mb-8">{html}</div>
        <div className="flex justify-end gap-4">
          <ArticleThumpsUp count={224} />
          <ArticleComment count={32} />
          <ArticleBookmark count={212} />
          <ArticleShare count={12} />
        </div>
        <CommentsSection />
      </div>
    </div>
  );
}
