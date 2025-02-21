import React, { useState } from "react";
import Image from "next/image";
import { ArticleType } from "@/types/ArticleType";
import { CommentType } from "@/types/CommentType";
import { Interweave } from "interweave";
import { polyfill } from "interweave-ssr";
polyfill();

export default function ViewArticle({
  author,
  title,
  content,
  image,
}: ArticleType) {
  const [comments, setComments] = useState<CommentType[]>([]);

  // Handle adding a new comment
  const handleAddComment = (commentContent: string) => {
    const newComment: CommentType = {
      id: `comment-${Date.now()}`,
      author: "Anonymous",
      content: commentContent,
    };
    setComments([newComment, ...comments]);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 lg:p-12 rounded-lg shadow-md my-10">
      {/* Cover Image */}
      <div className="relative w-full h-64 mb-6">
        <Image
          src={typeof image === "string" ? image : "/default-image.jpg"}
          alt=""
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        {title}
      </h1>

      {/* Author */}
      {author && <p className="text-gray-600 text-lg mb-6">By {author}</p>}

      {/* Content */}
      <Interweave content={content} />

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-black">Comments</h2>
        <button
          onClick={() => handleAddComment("This article is very insightful!")}
          className="mt-2 px-4 py-2 bg-blue-500 text-black rounded"
        >
          Add Comment
        </button>
        <ul className="mt-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b py-2">
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-sm text-gray-500">- {comment.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
