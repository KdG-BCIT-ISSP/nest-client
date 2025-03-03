import React from "react";
import { PostType } from "@/types/PostType";
import Image from "next/image";

export default function PostCard({
  title,
  content,
  tags,
  images,
  author,
  timestamp,
}: PostType) {
  return (
    <div className="bg-white border rounded-md relative mx-auto my-6 p-6 max-w-3xl shadow-md">
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center text-gray-500">
          <button className="p-1 text-gray-400 hover:text-cyan-500">▲</button>
          <span className="font-bold text-gray-800">123</span>{" "}
          {/* Vote count */}
          <button className="p-1 text-gray-400 hover:text-red-500">▼</button>
        </div>

        {/* Post Content Section */}
        <div className="flex-1">
          {/* Metadata */}
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium text-gray-800">
              {author || "Anonymous"}
            </span>{" "}
            • <span>{timestamp || "Just now"}</span>
          </div>

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
          <div className="mt-4 flex justify-between text-gray-500 text-sm">
            <button className="hover:text-cyan-600">💬 45 Comments</button>
            <button className="hover:text-cyan-600">🔗 Share</button>
            <button className="hover:text-cyan-600">⚙️ Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
