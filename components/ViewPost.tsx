import React, { useState } from "react";
import { PostType } from "@/types/PostType";
import { CommentType } from "@/types/CommentType";
import Image from "next/image";

export default function ViewPost({
  title,
  content,
  tags,
  images,
  author,
  timestamp,
}: PostType & {
  tags?: string[];
  images?: File[];
  author?: string;
  timestamp?: string;
}) {
  // Initialize comments state
  const [comments, setComments] = useState<CommentType[]>([]);

  // Handle adding a new comment
  const handleAddComment = (content: string) => {
    const newComment: CommentType = {
      id: `comment-${Date.now()}`,
      author: "Anonymous",
      content,
    };
    setComments([newComment, ...comments]); // Add new comment at the top
  };

  // Handle adding a reply to a comment
  const handleAddReply = (commentId: string, replyContent: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: `reply-${Date.now()}`,
                  author: "Anonymous",
                  content: replyContent,
                },
              ],
            }
          : comment
      )
    );
  };

  // Render comments with nested replies
  const renderComments = (comments: CommentType[]) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-black">{comment.author}</span>
          <span className="text-sm text-black">
            {new Date().toLocaleString()}
          </span>
        </div>
        <p className="mt-2 text-black">{comment.content}</p>

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 mt-2">{renderComments(comment.replies)}</div>
        )}

        {/* Reply button */}
        <button
          className="mt-2 text-sm text-blue-500"
          onClick={() => handleAddReply(comment.id, "This is a reply")}
        >
          Reply
        </button>
      </div>
    ));
  };

  return (
    <div className="bg-white border rounded-md relative mx-auto my-6 p-6 max-w-3xl shadow-md">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center text-gray-500">
          <button className="p-1 text-gray-400 hover:text-cyan-500">▲</button>
          <span className="font-bold text-black">123</span> {/* Vote count */}
          <button className="p-1 text-gray-400 hover:text-red-500">▼</button>
        </div>

        {/* Post Content Section */}
        <div className="flex-1">
          {/* Metadata */}
          <div className="text-sm text-black mb-2">
            <span className="font-medium text-black">
              {author || "Anonymous"}
            </span>{" "}
            • <span>{timestamp || "Just now"}</span>
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold text-black mb-2">
            {title || "Untitled Post"}
          </h1>

          {/* Content */}
          <p className="text-base text-black whitespace-pre-wrap mb-4">
            {content || "No content available."}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full text-black"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Image */}
          {images && images.length > 0 && (
            <div className="relative w-full h-64 overflow-hidden rounded-lg border border-gray-300">
              <Image
                src={URL.createObjectURL(images[0])}
                alt="Post Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                unoptimized
              />
            </div>
          )}

          {/* Interaction Bar */}
          <div className="mt-4 flex justify-between text-black text-sm">
            <button className="hover:text-cyan-600">💬 420 Comments</button>
            <button className="hover:text-cyan-600">🔗 Share</button>
            <button className="hover:text-cyan-600">⚙️ Save</button>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mt-6">
        <h2 className="font-bold text-black">Comments</h2>
        <div className="mt-4">
          <textarea
            placeholder="Add a comment"
            className="w-full p-2.5 border border-gray-300 rounded-md text-black"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                // Handle multiline input
              } else if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment(e.currentTarget.value);
                e.currentTarget.value = ""; // Clear the input after submitting
              }
            }}
          />
        </div>

        {/* Display Comments */}
        <div className="mt-4">{renderComments(comments)}</div>
      </div>
    </div>
  );
}
