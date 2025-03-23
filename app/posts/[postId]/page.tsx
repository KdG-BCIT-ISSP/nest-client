"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Back from "@/public/svg/Article/Back";
import Dots from "@/public/svg/Article/Dots";
import Report from "@/public/svg/Article/Report";
import ArticleThumpsUp from "@/public/svg/Article/ThumbsUp";
import ArticleComment from "@/public/svg/Article/Comment";
import ArticleBookmark from "@/public/svg/Article/Bookmark";
import ArticleShare from "@/public/svg/Article/Share";
import Tags from "@/components/Tags";
import CommentsSection from "@/components/Comments";
import { getPost } from "@/app/api/post/get/route";
import { PostType } from "@/types/PostType";
import { reportArticle } from "@/app/api/report/article/post/route";
import XIcon from "@/public/svg/XIcon";
import { get } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.postId);
  const [post, setPost] = useState<PostType>();
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [views, setViews] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [posts, views] = await Promise.all([
          getPost(),
          get(`/api/content/${postId}/views`),
        ]);
        const foundPosts = posts.find((item: PostType) => item.id === postId);
        if (foundPosts) {
          setPost({
            ...foundPosts,
            content: decodeURIComponent(foundPosts.content),
          });
          setViews(views);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Article not found</div>;

  const handleReportSubmit = async () => {
    if (!post || !post.id) return;
    try {
      await reportArticle(post.id, reportReason);
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
            By <b>{post.memberUsername}</b> |{" "}
            {formatDate(post.createdAt ?? "Unknown date")}
          </p>
          <p className="text-xs mt-2">{views} verified views</p>

          <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
            {post.title}
          </h1>

          <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
            {post.imageBase64?.map((x, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "300px",
                  height: "200px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={x}
                  alt="Article cover image"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  priority
                />
              </div>
            ))}
          </div>
        </div>

        <Tags tagsList={post.tagNames ?? []} />

        <div className="prose prose-green mb-8">{post.content}</div>
        <div className="flex justify-end gap-4">
          <ArticleThumpsUp count={224} isLiked={post.liked ?? false} />
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
