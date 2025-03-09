import React from "react";
import Image from "next/image";
import ArticleThumpsUp from "@/public/svg/Article/ThumbsUp";
import ArticleComment from "@/public/svg/Article/Comment";
import ArticleBookmark from "@/public/svg/Article/Bookmark";
import Trash from "@/public/svg/Article/Trash";
import Link from "next/link";
import { ReportCardProps } from "@/types/ReportCard";

export default function ReportCard({ post, reports }: ReportCardProps) {
  console.log(post);
  return (
    <div className="bg-report border border-gray-200 rounded-md p-4 w-full mx-auto shadow-md">
      <Link href={`/curated-articles/${post.id}`}>
        {/* Mobile view */}
        <div className="sm:hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
          {post.coverImage && (
            <div className="relative w-full h-52 mb-3 overflow-hidden rounded-sm border border-gray-300">
              <Image
                src={post.coverImage}
                alt="Post Image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <p className="text-gray-700 mb-3 truncate">{post.content}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
            <ArticleThumpsUp count={post.likeCount} reported />
            <ArticleComment count={post.commentCount} reported />
            <ArticleBookmark count={post.shareCount} reported />
          </div>
        </div>
      </Link>

      {/* Desktop view */}
      <Link href={`/curated-articles/${post.id}`}>
        <div className="hidden sm:block">
          <div className="flex gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3 truncate">{post.content}</p>
            </div>
            {post.coverImage && (
              <div className="relative w-64 h-32 flex-shrink-0 overflow-hidden rounded-sm border border-gray-300">
                <Image
                  src={post.coverImage}
                  alt="Post Image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
            <ArticleThumpsUp count={post.likeCount} reported />
            <ArticleComment count={post.commentCount} reported />
            <ArticleBookmark count={post.shareCount} reported />
          </div>
        </div>
      </Link>

      <hr className="border-gray-400 my-4" />

      <h3 className="text-md font-bold text-gray-900 mb-2">Reports</h3>
      <ul className="space-y-2 mb-6">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex items-center justify-between bg-white p-3 rounded-md border hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm text-gray-700">{report.reason}</span>
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
