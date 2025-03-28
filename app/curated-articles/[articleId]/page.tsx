"use client";
export const dynamic = "force-dynamic";

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
import CommentsSection from "@/components/Comments";
import { ArticleType } from "@/types/ArticleType";
import XIcon from "@/public/svg/XIcon";
import Tags from "@/components/Tags";
import { get, post } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "next-i18next";

export default function ArticleDetailsPage() {
  useTranslation(); // TODO: Finish translating
  const params = useParams();
  const articleId = Number(params.articleId);
  const [article, setArticle] = useState<ArticleType>();
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [views, setViews] = useState(0);

  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const promises = [
          get(`/api/content/id/${articleId}`),
          get(`/api/content/${articleId}/views`),
          get(`/api/content/${articleId}/likes`),
        ];

        if (isAuthenticated) {
          promises.push(get(`/api/content/${articleId}/isLiked`));
        }

        const [article, views, likes, isLiked] = await Promise.all(promises);

        setArticle({
          ...article,
          content: decodeURIComponent(article.content),
          likes,
          isLiked: isAuthenticated ? isLiked : false,
        });

        setViews(views);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [articleId, isAuthenticated]);

  const handleToggleLike = async () => {
    if (!article || !isAuthenticated) {
      alert("Please log in to like this article.");
      return;
    }

    const previousState = { isLiked: article.isLiked, likes: article.likes };

    setArticle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        likes: !prev.isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      };
    });

    try {
      const { isLiked: newIsLiked } = await post(
        `/api/content/${articleId}/toggleLike`,
        { articleId }
      );

      const updatedLikes = await get(`/api/content/${articleId}/likes`);

      setArticle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: newIsLiked,
          likes: updatedLikes,
        };
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      setArticle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: previousState.isLiked || false,
          likes: previousState.likes || 0,
        };
      });
      alert("Failed to toggle like. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  const html = parse(article.content);

  const handleReportSubmit = async () => {
    if (!article || !article.id) return;
    try {
      await post(`/api/report/article/${article.id}`, { reason: reportReason });
      alert("Reported successfully");
      setShowReport(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting article:", error);
    }
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
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
          <div className="bg-white p-6 rounded-md w-1/4 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
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
              className="w-full p-2 border-none focus:outline-none focus:ring-0 bg-gray-200"
              rows={8}
            />

            <div className="flex justify-end">
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
            By <b>{article.memberUsername}</b> |{" "}
            {formatDate(article.createdAt ?? "")}
          </p>
          <p className="text-xs mt-2">{views} verified views</p>

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
          <button onClick={handleToggleLike} disabled={!isAuthenticated}>
            <ArticleThumpsUp
              count={article.likes || 0}
              isLiked={article.isLiked || false}
            />
          </button>
          <ArticleComment count={32} />
          <ArticleBookmark count={212} />
          <button onClick={handleShareClick}>
            <ArticleShare count={12} />
          </button>
        </div>
        <CommentsSection />
      </div>

      {showCopied && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white px-4 py-2 rounded transition-opacity duration-500">
          URL copied to clipboard!
        </div>
      )}
    </div>
  );
}
