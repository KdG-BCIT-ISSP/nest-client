import { useState, useEffect } from "react";
import Report from "@/public/svg/Report";
import Trash from "@/public/svg/Trash";
import { del, get, post, put } from "@/app/lib/fetchInterceptor";
import { ContentType, Comment } from "@/types/ContentType";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import { userAtom } from "@/atoms/user/atom";
import { useAtom } from "jotai";
import { Like, Comments } from "@/components/Icons";
import { EllipsisIcon } from "lucide-react";
import Loader from "./Loader";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number, replyContent: string) => void;
  updateCommentLikes: (
    commentId: number,
    likes: number,
    isLiked: boolean
  ) => void;
  contentId: number;
  onDelete: (commentId: number) => Promise<void>;
}

function extractErrorMessage(error: Error): string {
  const parts = error.message.split('-');
  return parts[1]?.trim() || error.message;
}

function CommentItem({
  comment,
  onReply,
  updateCommentLikes,
  contentId,
  onDelete,
}: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [commentLiked, setCommentLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(0);
  const [replyContent, setReplyContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [userData] = useAtom(userAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyBox(false);
  };

  useEffect(() => {
    const fetchCommentLikes = async () => {
      try {
        const likes = await get(`/api/comment/${comment.id}/likes`);
        setCommentLikes(likes);
      } catch (error) {
        console.error("Error fetching comment likes:", error);
      }
    };

    const checkIfLiked = async () => {
      try {
        const isLiked = await get(`/api/comment/${comment.id}/isLiked`);
        setCommentLiked(isLiked);
      } catch (error) {
        console.error("Error checking if comment is liked:", error);
      }
    };

    if (isAuthenticated) {
      fetchCommentLikes();
      checkIfLiked();
    }
  }, [comment.id, isAuthenticated]);

  const handleToggleLike = async () => {
    const previousLiked = commentLiked;
    const previousLikes = commentLikes;

    // optimistic update
    const newLiked = !previousLiked;
    const newLikes = newLiked
      ? previousLikes + 1
      : Math.max(0, previousLikes - 1);
    setCommentLiked(newLiked);
    setCommentLikes(newLikes);
    updateCommentLikes(comment.id, newLikes, newLiked);

    try {
      await post(`/api/comment/${comment.id}/toggleLike`, {});
      const likesResponse = await get(`/api/comment/${comment.id}/likes`);
      setCommentLikes(likesResponse);
      updateCommentLikes(comment.id, likesResponse, newLiked);
    } catch (error) {
      setCommentLiked(previousLiked);
      setCommentLikes(previousLikes);
      updateCommentLikes(comment.id, previousLikes, previousLiked);
      console.error("Error toggling comment like:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment.id);
      setShowOptions(false);
    }
  };

  const handleReport = () => {
    alert("Report comment functionality not implemented");
    setShowOptions(false);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    try {
      await put(`/api/comment`, {
        id: comment.id,
        postId: contentId,
        content: editContent,
        memberId: Number(comment.memberId),
      });
      comment.content = editContent;
      setIsEditing(false);
    } catch (error) {
      window.alert(extractErrorMessage(error as Error));
    }
  };

  const canReply = comment.parentId === null;
  const isOwnCommentOrAdmin =
    userData?.userId == String(comment.memberId) ||
    userData.role === "ADMIN" ||
    userData.role === "SUPER_ADMIN" ||
    userData.role === "MODERATOR";

  return (
    <div className="relative ml-4 pl-4 border-l border-gray-300 mb-4">
      <div className="flex items-center mb-1">
        <Image
          className="w-8 h-8 rounded-full object-cover mr-2"
          src={
            comment.memberAvatar.image || "/images/default_profile_image.png"
          }
          alt="Member avatar"
          width={8}
          height={8}
        />
        <div className="font-semibold">{comment.userName}</div>
        <span className="ml-2 text-xs text-gray-500">
          {formatDate(comment.createAt)}
        </span>
        <div className="ml-auto relative">
          {isAuthenticated && (
            <button onClick={() => setShowOptions((prev) => !prev)}>
              <EllipsisIcon />
            </button>
          )}
          {showOptions && (
            <div className="absolute right-0 mt-1 z-10 flex flex-col gap-1 bg-white shadow-md rounded-md p-1">
              {isOwnCommentOrAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                    className="w-full px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md flex items-center justify-center gap-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100 rounded-md flex items-center justify-center gap-1"
                  >
                    <Trash />
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="w-full px-2 py-1.5 text-sm text-gray-600 rounded-md flex items-center justify-center gap-1"
                >
                  <Report />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-2 mt-2">
          <textarea
            className="flex-1 p-2 border rounded border-gray-300"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryPressed"
            onClick={handleEditSubmit}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => {
              setIsEditing(false);
              setEditContent(comment.content);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="mb-2">{comment.content}</div>
      )}

      <div className="flex gap-4 mb-2">
        <Like
          count={commentLikes || 0}
          isLiked={commentLiked || false}
          onClick={handleToggleLike}
          disabled={!isAuthenticated}
        />
        {canReply && (
          <button
            className="text-sm text-tertiary hover:underline"
            onClick={() => setShowReplyBox(!showReplyBox)}
            disabled={!isAuthenticated}
          >
            <Comments count={comment.replies?.length || 0} />
          </button>
        )}
      </div>

      {showReplyBox && canReply && (
        <div className="flex gap-2 mt-2 h-10">
          <textarea
            className="flex-1 p-2 border rounded border-gray-300"
            placeholder="Write a reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryPressed"
            onClick={handleReplySubmit}
          >
            Submit
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              updateCommentLikes={updateCommentLikes}
              contentId={contentId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentsSectionProps {
  contentData: ContentType;
  refetchContent: () => void;
}

export default function CommentsSection({
  contentData,
  refetchContent,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    try {
      setLoading(true);
      setComments(contentData.comment || []);
    } catch (error) {
      console.error("Error organizing comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [contentData]);

  const updateCommentLikes = (
    commentId: number,
    likes: number,
    isLiked: boolean
  ) => {
    const updateLikes = (commentList: Comment[]): Comment[] => {
      return commentList.map((c) => {
        if (c.id === commentId) {
          return { ...c, likesCount: likes, liked: isLiked };
        } else if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateLikes(c.replies) };
        }
        return c;
      });
    };
    setComments((prev) => updateLikes(prev));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await post(`/api/comment`, {
        postId: contentData.id,
        parentId: null,
        content: newComment,
        createAt: new Date().toISOString(),
      });
      await refetchContent();
      setNewComment("");
    } catch (error: unknown) {
      window.alert(extractErrorMessage(error as Error));
      console.error("Error adding comment:", error);
      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response &&
        "status" in error.response
      ) {
        alert("Unauthorized: Please log in to comment.");
      }
    }
  };

  const handleReply = async (parentId: number, replyContent: string) => {
    try {
      await post(`/api/comment`, {
        postId: contentData.id,
        parentId,
        content: replyContent,
        createAt: new Date().toISOString(),
      });
      await refetchContent();
    } catch (error: unknown) {
      window.alert(extractErrorMessage(error as Error));
      console.error("Error adding reply:", error);
      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response &&
        "status" in error.response
      ) {
        alert("Unauthorized: Please log in to reply.");
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await del(`/api/comment/${commentId}`, {});
      await refetchContent();
    } catch (error: unknown) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment.");
    }
  };

  if (loading) {
    return <Loader />;
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full mx-auto font-sans text-gray-800 py-10">
      {isAuthenticated && (
        <div className="flex items-start mb-4 gap-2">
          <textarea
            className="flex-1 p-2 border rounded border-gray-300 h-10"
            placeholder="Write a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondaryPressed"
            onClick={handleAddComment}
          >
            Send
          </button>
        </div>
      )}

      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            updateCommentLikes={updateCommentLikes}
            contentId={contentData.id}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </div>
  );
}
