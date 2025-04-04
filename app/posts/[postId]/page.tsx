"use client";
export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, CircleXIcon, ShowerHead } from "lucide-react";
import { EllipsisIcon } from "lucide-react";
import Report from "@/public/svg/Report";
import Tags from "@/components/admin/Tags";
// import CommentsSection from "@/components/Comments";
import { PostType } from "@/types/PostType";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { Like, Comments, Bookmark, Share } from "@/components/Icons";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import CreatePost from "@/components/post/CreatePost";
import Modal from "@/components/Modal";

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.postId);
  const [userdata] = useAtom(userAtom);
  const [userPost, setPost] = useState<PostType>();
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [showDeleteWindow, setShowDeleteWindow] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [views, setViews] = useState(0);
  const isOwnerOrAdmin =
    Number(userdata.userId) === userPost?.memberId || userdata.role === "ADMIN" || userdata.role === "SUPER_ADMIN";

  console.log(isOwnerOrAdmin)




  console.log("userdata", userdata);

  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [userPost, views] = await Promise.all([
          get(`/api/content/id/${postId}`),
          get(`/api/content/${postId}/views`),
        ]);
        setPost({
          ...userPost,
          content: decodeURIComponent(userPost.content),
        });
        console.log("userPost", userPost);
        setViews(views);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (!userPost) return <div>Article not found</div>;

  const handleReportSubmit = async () => {
    if (!userPost || !userPost.id) return;
    try {
      await post(`/api/report/article/${userPost.id}`, {
        reason: reportReason,
      });
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

  const handleBookmarkToggle = async () => {
    try {
      if (typeof postId === "number") {
        await put(`/api/content/${postId}/toggleBookmark`, {});
      } else {
        console.error("Invalid postId:", postId);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!userPost || !userPost.id) return;
    try {
      await del(`/api/posts/${userPost.id}`);
      alert("Posts deleted successfully");
      window.location.href = "/posts";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="w-max mx-auto pt-10">
      <div className="flex justify-between items-center p-4">
        <button onClick={() => window.history.back()}>
          <ArrowLeft />
        </button>
        <div className="relative">
          <button onClick={() => setShowEditMenu((prev) => !prev)}>
            <EllipsisIcon />
          </button>
          {showEditMenu && (
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
                className="text-secondary hover:text-secondaryPressed cursor-pointer"
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
                className="px-4 py-2 bg-secondary font-bold text-white rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPost && (
        <Modal isOpen={showEditPost} onClose={() => setShowEditPost(false)}>
          <CreatePost existingPost={userPost} />
        </Modal>
      )}

      {showDeleteWindow && (
        <Modal
          isOpen={showDeleteWindow}
          onClose={() => setShowDeleteWindow(false)}
        >
          <div className="bg-white p-6 rounded-md flex flex-col space-y-4 justify-center items-center">
            <h1 className="text-xl font-bold">Are you sure?</h1>
            <p>Do you really want to delete this article?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteWindow(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="max-w-2xl mx-auto p-4 pt-4 text-black">
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            By <b>{userPost.memberUsername}</b> |{" "}
            {formatDate(userPost.createdAt ?? "Unknown date")}
          </p>
          <p className="text-xs mt-2">{views} verified views</p>

          <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
            {userPost.title}
          </h1>

          {userPost.imageBase64?.length === 1 ? (
            <div className="w-full max-w-screen-md mx-auto px-4 py-6">
              <Image
                src={userPost.imageBase64[0]}
                alt="Post image"
                width={1000}
                height={0}
                className="w-full h-auto object-contain rounded-md"
                priority
              />
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 py-6 px-4">
              {userPost.imageBase64?.map((img, index) => (
                <div
                  key={index}
                  className="relative min-w-[300px] max-w-[800px] w-full aspect-[16/9] flex-shrink-0 rounded-md overflow-hidden border"
                >
                  <Image
                    src={img}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          )}

          <Tags tagsList={userPost.tagNames ?? []} />

          <div className="prose prose-green mb-8">{userPost.content}</div>
          <div className="flex justify-end gap-4">
            <Like
              count={userPost.likesCount || 0}
              isLiked={userPost.liked || false}
              onClick={() => { }}
              disabled={!isAuthenticated}
            />
            <Comments count={userPost.comment?.length ?? 0} />
            <Bookmark
              count={12}
              isSaved={userPost.bookmarked || false}
              disabled={!isAuthenticated}
              onClick={handleBookmarkToggle}
            />
            <Share onClick={handleShareClick} />
          </div>

          {/* <CommentsSection /> */}
        </div>

        {showCopied && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white px-4 py-2 rounded transition-opacity duration-500">
            URL copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
