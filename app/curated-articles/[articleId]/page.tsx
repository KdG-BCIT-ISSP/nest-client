"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CircleXIcon } from "lucide-react";
import { EllipsisIcon } from "lucide-react";
import parse from "html-react-parser";
import Report from "@/public/svg/Report";
import { Like, Comments, Bookmark, Share } from "@/components/Icons";
import CommentsSection from "@/components/Comments";
import { ArticleType } from "@/types/ContentType";
import Tags from "@/components/admin/Tags";
import { get, post, put } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "next-i18next";
import Loader from "@/components/Loader";

export default function ArticleDetailsPage() {
  useTranslation();
  const params = useParams();
  const articleId = Number(params.articleId);
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const fetchArticleData = async () => {
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
      const [articleData, views, likes, isLiked] = await Promise.all(promises);
      setArticle({
        ...articleData,
        content: decodeURIComponent(articleData.content),
        likes,
        isLiked: isAuthenticated ? isLiked : false,
      });
      setViews(views);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, isAuthenticated]);

  const handleToggleLike = async () => {
    if (!article || !isAuthenticated) {
      alert("Please log in to like this article.");
      return;
    }

    const previousState = { isLiked: article.isLiked, likes: article.likes };

    // Optimistic UI update
    setArticle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        likes: !prev.isLiked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
      };
    });

    try {
      const response = await post(`/api/content/${articleId}/toggleLike`, {
        articleId,
      });
      const newIsLiked =
        response.isLiked !== undefined ? response.isLiked : !article.isLiked;
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

  const handleBookmarkToggle = async () => {
    try {
      if (typeof articleId === "number") {
        await put(`/api/content/${articleId}/toggleBookmark`, {});
      } else {
        console.error("Invalid articleId:", articleId);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }
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
          <ArrowLeft />
        </button>
        <div className="relative">
          <button onClick={() => setShowReportButton((prev) => !prev)}>
            <EllipsisIcon />
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

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-md w-1/4 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Submit a report</h1>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <CircleXIcon />
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
                className="px-4 py-2 bg-secondary font-bold text-white rounded hover:bg-secondaryPressed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto p-4 pt-4 text-black">
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            By <b>{article.memberUsername}</b> |{" "}
            {formatDate(article.createdAt ?? "")}
          </p>
          <p className="text-xs mt-2">{views} verified views</p>
          <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
            {article.title}
          </h1>
          <Tags tagsList={article.tagNames ?? []} />
          <div className="w-full max-w-screen-md mx-auto px-4">
            <Image
              src={article.coverImage}
              alt="Article cover image"
              width={1000}
              height={0}
              className="w-full h-auto object-contain rounded-md"
              priority
            />
          </div>
        </div>
        <hr className="border-gray-600 p-4" />
        <div className="prose prose-green mb-8">{html}</div>
        <div className="flex justify-end gap-4">
          <Like
            count={article.likes || 0}
            isLiked={article.isLiked || false}
            onClick={handleToggleLike}
            disabled={!isAuthenticated}
          />
          <Comments count={article.comment?.length ?? 0} />
          <Bookmark
            count={12}
            isSaved={article.bookmarked || false}
            disabled={!isAuthenticated}
            onClick={handleBookmarkToggle}
          />
          <Share onClick={handleShareClick} />
        </div>
        <CommentsSection
          contentData={article}
          refetchContent={fetchArticleData}
        />
      </div>

      {showCopied && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white px-4 py-2 rounded transition-opacity duration-500">
          URL copied to clipboard!
        </div>
      )}
    </div>
  );
}
