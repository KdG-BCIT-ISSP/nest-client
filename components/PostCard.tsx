import React from "react";
import Image from "next/image";
import clsx from "clsx";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";
import Share from "@/public/svg/Post/Share";
import { PostCardType } from "@/types/PostCardType";
import BookmarkToggle from "../components/Bookmark";

export default function PostCard({
  id,
  className,
  title = "Untitled Post",
  content = "No content available.",
  tags,
  imageBase64,
  author = "Anonymous",
  timestamp = "Just now",
  isBookmarked,
}: PostCardType) {
  return (
    <div
      className={clsx(
        "border rounded-md relative mx-auto my-6 p-4 shadow-md w-full",
        className
      )}
    >
      <div className="block sm:hidden">
        {imageBase64 && imageBase64.length > 0 && (
          <div className="flex flex-wrap">
            {imageBase64.map((base64, index) => (
              <div
                key={index}
                className="w-full h-52 mb-3 relative overflow-hidden rounded-sm border border-gray-300"
              >
                <Image
                  src={base64}
                  alt={`Post Image ${index}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex flex-row items-center text-gray-500">
            <button className="p-1 text-gray-400 hover:text-cyan-500">▲</button>
            <span className="font-bold text-gray-800">123</span>
            <button className="p-1 text-gray-400 hover:text-red-500">▼</button>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-800">{author}</span> •{" "}
              <span>{timestamp}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {content}
            </p>
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
                <BookmarkToggle count={32} postId={id} filled={true} />
              </button>
              <button className="hover:text-cyan-600">
                <Share />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex gap-4">
        <div className="flex flex-col items-center text-gray-500">
          <button className="p-1 text-gray-400 hover:text-cyan-500">▲</button>
          <span className="font-bold text-gray-800">123</span>
          <button className="p-1 text-gray-400 hover:text-red-500">▼</button>
        </div>
        <div className="flex flex-1 gap-4">
          <div className="flex-1 flex flex-col">
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-800">{author}</span> •{" "}
              <span>{timestamp}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {content}
            </p>
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
                <BookmarkToggle count={32} postId={id} filled={isBookmarked} />
              </button>
              <button className="hover:text-cyan-600">
                <Share />
              </button>
            </div>
          </div>
          {imageBase64 && imageBase64.length > 0 && (
            <div className="flex flex-wrap">
              {imageBase64.map((base64, index) => (
                <div
                  key={index}
                  className="relative w-72 h-auto aspect-[16/9] overflow-hidden rounded-sm border border-gray-300"
                >
                  <Image
                    src={base64}
                    alt={`Post Image ${index}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
