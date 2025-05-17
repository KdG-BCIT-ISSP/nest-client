"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CircleXIcon,
  EllipsisIcon,
  MessageSquareText,
} from "lucide-react";
import Tags from "@/components/admin/Tags";
import CommentsSection from "@/components/Comments";
import { PostType } from "@/types/ContentType";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { Like, Comments, Bookmark, Share } from "@/components/Icons";
import CreatePost from "@/components/post/CreatePost";
import Modal from "@/components/Modal";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import Loader from "@/components/Loader";
import { marked } from "marked";
import parse from "html-react-parser";
import { useTranslation } from "next-i18next";
import { translateViaApi } from "@/app/lib/translate";

const tCache: Map<string, { title: string; content: string }> = new Map();

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.postId);
  const [userdata] = useAtom(userAtom);
  const { i18n } = useTranslation("post");
  const locale = i18n.language;

  const [userPost, setPost] = useState<PostType>({ type: "post" } as PostType);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [showDeleteWindow, setShowDeleteWindow] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [views, setViews] = useState(0);
  const [html, setHtml] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showMemberPopup, setShowMemberPopup] = useState(false);

  const isOwnerOrAdmin =
    Number(userdata.userId) === userPost?.memberId ||
    userdata.role === "ADMIN" ||
    userdata.role === "SUPER_ADMIN" ||
    userdata.role === "MODERATOR";

  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const [rawPost, viewsData] = await Promise.all([
        get(`/api/content/id/${postId}`),
        get(`/api/content/${postId}/views`),
      ]);

      let translatedPost: PostType = {
        ...rawPost,
        type: rawPost.type ?? "post",
        content: rawPost.content,
      };

      if (locale !== "en") {
        const cKey = `${postId}-${locale}`;
        if (tCache.has(cKey)) {
          translatedPost = { ...translatedPost, ...tCache.get(cKey)! };
        } else {
          const [titleTr, bodyTr] = await Promise.all([
            translateViaApi(rawPost.title ?? "", locale),
            translateViaApi(rawPost.content ?? "", locale),
          ]);
          tCache.set(cKey, { title: titleTr, content: bodyTr });
          translatedPost = {
            ...translatedPost,
            title: titleTr,
            content: bodyTr,
          };
        }
      }

      setPost(translatedPost);
      setViews(viewsData);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, locale, isAuthenticated]);

  useEffect(() => {
    if (!userPost?.content) return;

    async function convertMarkdown() {
      const parsed = await marked.parse(userPost?.content ?? "");
      setHtml(parsed);
    }

    convertMarkdown();
  }, [userPost?.content]);

  if (loading) {
    return <Loader />;
  }
  if (!userPost) return <div>Post not found</div>;

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

  const handleToggleLike = async () => {
    if (!userPost || !isAuthenticated) {
      alert("Please log in to like this article.");
      return;
    }

    const previousState = {
      isLiked: userPost.liked,
      likesCount: userPost.likesCount,
    };

    // Optimistic update
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        liked: !prev.liked,
        likesCount: !prev.liked
          ? (prev.likesCount || 0) + 1
          : (prev.likesCount || 0) - 1,
      };
    });

    try {
      const response = await post(`/api/content/${userPost.id}/toggleLike`, {
        userPostId: userPost.id,
      });
      const newIsLiked =
        response.isLiked !== undefined ? response.isLiked : !userPost.liked;
      const updatedLikes = await get(`/api/content/${userPost.id}/likes`);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          liked: newIsLiked,
          likesCount: updatedLikes,
        };
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          liked: previousState.isLiked,
          likesCount: previousState.likesCount,
        };
      });
      alert("Failed to toggle like. Please try again.");
    }
  };

  const handleBookmarkToggle = async () => {
    if (!userPost || !isAuthenticated) {
      alert("Please log in to bookmark this article.");
      return;
    }

    const previousState = {
      bookmarked: userPost.bookmarked,
      bookmarkCount: userPost.bookmarkCount,
    };

    // Optimistically update
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookmarked: !prev.bookmarked,
        bookmarkCount: !prev.bookmarked
          ? (prev.bookmarkCount || 0) + 1
          : (prev.bookmarkCount || 0) - 1,
      };
    });

    try {
      await put(`/api/content/${postId}/toggleBookmark`, {});
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          bookmarked: previousState.bookmarked,
          bookmarkCount: previousState.bookmarkCount,
        };
      });
      alert("Failed to toggle bookmark. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!userPost || !userPost.id) return;
    try {
      await del(`/api/posts/${userPost.id}`);
      alert("Post deleted successfully");
      window.location.href = "/posts";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleMemberClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const topPosition = isMobile
      ? rect.bottom + window.scrollY
      : rect.bottom + window.scrollY + 10;
    const leftPosition = isMobile
      ? rect.left + window.scrollX
      : rect.right + window.scrollX - 150;

    setPopupPosition({
      top: topPosition,
      left: leftPosition,
    });

    setShowMemberPopup((prev) => !prev);
  };

  return (
    <div className="max-w-2xl w-full mx-auto pt-10">
      <div className="flex justify-between items-center p-4">
        <button onClick={() => window.history.back()}>
          <ArrowLeft />
        </button>
        <div className="relative">
          <button onClick={() => setShowEditMenu((prev) => !prev)}>
            <EllipsisIcon />
          </button>
          {showEditMenu && (
            <div className="absolute right-0 mt-1 z-10 cursor-pointer bg-white rounded-md shadow-lg border border-gray-200">
              {isOwnerOrAdmin && (
                <>
                  <div
                    onClick={() => setShowEditPost((prev) => !prev)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </div>
                  <div
                    onClick={() => setShowDeleteWindow((prev) => !prev)}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                  >
                    Delete
                  </div>
                </>
              )}
              <div
                onClick={() => setShowReport((prev) => !prev)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Report
              </div>
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

      {/* Edit Post Modal */}
      {showEditPost && (
        <Modal isOpen={showEditPost} onClose={() => setShowEditPost(false)}>
          <CreatePost
            existingPost={{
              ...userPost,
              topicId: userPost.topicId || 0,
              memberAvatar: userPost.memberAvatar
                ? [userPost.memberAvatar]
                : undefined,
              imageBase64: userPost.imageBase64 || [],
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteWindow && (
        <Modal
          isOpen={showDeleteWindow}
          onClose={() => setShowDeleteWindow(false)}
        >
          <div className="bg-white p-6 rounded-md flex flex-col space-y-4 justify-center items-center">
            <h1 className="text-xl font-bold">Are you sure?</h1>
            <p>Do you really want to delete this post?</p>
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
            By{" "}
            <b
              onClick={isAuthenticated ? handleMemberClick : undefined}
              className="cursor-pointer text-blue-500"
            >
              {userPost.memberUsername}
            </b>{" "}
            | {formatDate(userPost.createdAt ?? "Unknown date")}
          </p>
          {showMemberPopup && (
            <div
              className="absolute bg-white border shadow-md rounded-md p-2 z-50"
              style={{ top: popupPosition.top, left: popupPosition.left }}
            >
              <button
                className="flex flex-row gap-2 text-sm w-full text-left px-4 py-2 text-gray-700"
                onClick={() => {}} // Handle click to chat page with new chat @jasper-oh
              >
                <MessageSquareText size={18} />
                Chat
              </button>
            </div>
          )}
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
          <div className="prose prose-green mb-8">{parse(html)}</div>
          <div className="flex justify-end gap-4">
            <Like
              count={userPost.likesCount || 0}
              isLiked={userPost.liked || false}
              onClick={handleToggleLike}
              disabled={!isAuthenticated}
            />
            <Comments count={userPost.comment?.length ?? 0} />
            <Bookmark
              count={userPost.bookmarkCount || 0}
              isSaved={userPost.bookmarked || false}
              disabled={!isAuthenticated}
              onClick={handleBookmarkToggle}
            />
            <Share onClick={handleShareClick} />
          </div>
          <CommentsSection
            contentData={userPost}
            refetchContent={fetchPostData}
          />
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
