import React, { useState, useEffect } from "react";
import Dots from "@/public/svg/Article/Dots";
import Report from "@/public/svg/Article/Report";
import ThumbsUp from "@/public/svg/Article/ThumbsUp";
import CommentsIcon from "@/public/svg/Post/Comment";
import Trash from "@/public/svg/Article/Trash";
import { del, get, post } from "@/app/lib/fetchInterceptor";
import { ContentType, Comment } from "@/types/ContentType";
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

function CommentItem({
  comment,
  onReply,
  updateCommentLikes,
  contentId,
  onDelete,
}: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyBox(false);
  };

  const handleToggleLike = async () => {
    try {
      const isLiked = await post(`/api/comment/${comment.id}/toggleLike`, {});
      const likes = await get(`/api/comment/${comment.id}/likes`);
      updateCommentLikes(comment.id, likes, isLiked);
    } catch (error) {
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

  const canReply = comment.parentId === null;

  return (
    <div className="relative ml-4 pl-4 border-l border-gray-300 mb-4">
      <div className="flex items-center mb-1">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2 uppercase">
          {comment.author}
        </div>
        <div className="font-semibold">{comment.author}</div>
        <span className="ml-2 text-xs text-gray-500">{comment.time}</span>
        <div className="ml-auto relative">
          <button onClick={() => setShowOptions((prev) => !prev)}>
            <Dots />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-1 z-10">
              <button
                onClick={handleDelete}
                className="w-full px-2 py-1.5 text-sm text-red-600 bg-gray-200 rounded-md flex items-center justify-center gap-1"
              >
                <Trash />
                Delete
              </button>
              <button onClick={handleReport}>
                <Report />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">{comment.content}</div>

      <div className="flex gap-4 mb-2">
        <button onClick={handleToggleLike}>
          <ThumbsUp
            count={comment.likes || 0}
            isLiked={comment.isLiked || false}
          />
        </button>
        {canReply && (
          <button
            className="text-sm text-tertiary hover:underline"
            onClick={() => setShowReplyBox(!showReplyBox)}
          >
            <CommentsIcon count={comment.replies?.length || 0} />
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
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-green-600"
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

  useEffect(() => {
    try {
      setLoading(true);
      const organizedComments = organizeComments(contentData.comment || []);
      setComments(organizedComments);
    } catch (error) {
      console.error("Error organizing comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [contentData]);

  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const topLevelComments: Comment[] = [];

    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    flatComments.forEach((comment) => {
      if (comment.parentId === null) {
        topLevelComments.push(comment);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      }
    });

    return topLevelComments;
  };

  const updateCommentLikes = (
    commentId: number,
    likes: number,
    isLiked: boolean
  ) => {
    const updateLikes = (commentList: Comment[]): Comment[] => {
      return commentList.map((c) => {
        if (c.id === commentId) {
          return { ...c, likes, isLiked };
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

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full mx-auto font-sans text-gray-800 py-10">
      <div className="flex items-start mb-4 gap-2">
        <textarea
          className="flex-1 p-2 border rounded border-gray-300 h-10"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-green-600"
          onClick={handleAddComment}
        >
          Send
        </button>
      </div>

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
