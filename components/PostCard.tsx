import React from "react";
import { PostType } from "@/types/PostType";
import Image from "next/image";
import clsx from "clsx";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";
import Bookmark from "@/public/svg/Post/Bookmark";
import Share from "@/public/svg/Post/Share";

export default function PostCard({
  saved,
  className,
  title,
  content,
  tags,
  images,
  author,
  timestamp,
}: PostType) {
  return (
    <div
      className={clsx(
        "border rounded-md relative mx-auto my-6 p-6 shadow-md w-full max-w-4xl",
        className
      )}
    >
      <div className="flex gap-4 h-full">
        {" "}
        {/* Voting Section */}
        {!saved && (
          <div className="flex flex-col items-center text-gray-500">
            <button className="p-1 text-gray-400 hover:text-cyan-500">▲</button>
            <span className="font-bold text-gray-800">123</span>
            <button className="p-1 text-gray-400 hover:text-red-500">▼</button>
          </div>
        )}
        <div className="flex flex-1 gap-4 h-full">
          <div className="flex-1 flex flex-col">
            {/* Metadata */}
            {!saved && (
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium text-gray-800">
                  {author || "Anonymous"}
                </span>{" "}
                • <span>{timestamp || "Just now"}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              {title || "Untitled Post"}
            </h1>

            {/* Content */}
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {content || "No content available."}
            </p>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-between text-gray-500 text-sm">
              <button className="hover:text-cyan-600">
                <ThumbsUp count={32} />
              </button>
              <button className="hover:text-cyan-600">
                <Comments count={234} container />
              </button>
              <button className="hover:text-cyan-600">
                <Bookmark count={32} container filled={saved} />
              </button>
              <button className="hover:text-cyan-600">
                <Share />
              </button>
            </div>
          </div>
          {/* Image */}
          {images && (
            <div className="w-64 flex-shrink-0 h-full">
              <div className="relative h-full min-h-40 overflow-hidden rounded-sm border border-gray-300">
                <Image
                  src={images}
                  alt="Post Image"
                  fill
                  className="rounded-sm object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
