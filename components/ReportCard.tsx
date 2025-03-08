import React, { useState } from "react";
import Image from "next/image";
import ArticleThumpsUp from "@/public/svg/Article/ThumbsUp";
import ArticleComment from "@/public/svg/Article/Comment";
import ArticleBookmark from "@/public/svg/Article/Bookmark";
import Trash from "@/public/svg/Article/Trash";

interface ReportReason {
  id: number;
  text: string;
}

export default function ReportCard() {
  // mock post data
  const [post] = useState({
    title: "5 Healthy Snacks for Nursing Moms",
    content:
      "Nursing moms often find themselves feeling hungry throughout the day, and healthy snacks can provide the fuel needed to keep going. Greek yogurt with fresh fruit is an excellent choice, offering both protein and calcium.",
    likeCount: 3300,
    commentCount: 1300,
    shareCount: 239,
    imageUrl: "/images/pregnancy1.jpg",
  });

  // mock list of reasons
  const [reasons] = useState<ReportReason[]>([
    {
      id: 1,
      text: "The post contains offensive or discriminatory language.",
    },
    {
      id: 2,
      text: "The post spreads false or misleading information.",
    },
    {
      id: 3,
      text: "The post includes nudity, violence, or other prohibited material.",
    },
  ]);

  return (
    <div className="bg-report border border-gray-200 rounded-md p-4 w-full mx-auto shadow-md">
      <div className="sm:hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
        {post.imageUrl && (
          <div className="relative w-full h-52 mb-3 overflow-hidden rounded-sm border border-gray-300">
            <Image
              src={post.imageUrl}
              alt="Post Image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <p className="text-gray-700 mb-3">{post.content}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <ArticleThumpsUp count={234} reported />
          <ArticleComment count={234} reported />
          <ArticleBookmark count={32} reported />
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="flex gap-4 mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-3">{post.content}</p>
          </div>
          {post.imageUrl && (
            <div className="relative w-64 h-32 flex-shrink-0 overflow-hidden rounded-sm border border-gray-300">
              <Image
                src={post.imageUrl}
                alt="Post Image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <ArticleThumpsUp count={234} reported />
          <ArticleComment count={234} reported />
          <ArticleBookmark count={32} reported />
        </div>
      </div>

      <hr className="border-gray-400 my-4" />

      <h3 className="text-md font-bold text-gray-900 mb-2">Report Reason</h3>
      <ul className="space-y-2 mb-6">
        {reasons.map((reason) => (
          <li
            key={reason.id}
            className="
              flex items-center justify-between bg-white p-3 rounded-md border 
              hover:bg-gray-50 cursor-pointer
            "
          >
            <span className="text-sm text-gray-700">{reason.text}</span>
            <button className="p-1 text-red-500 hover:text-red-600">
              <Trash />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end space-x-2">
        <button className="px-3 py-2 text-sm font-medium bg-transparent border border-tertiary text-red-700 rounded hover:bg-red-200">
          Delete Reports
        </button>
        <button className="px-3 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600">
          Delete Post
        </button>
      </div>
    </div>
  );
}
