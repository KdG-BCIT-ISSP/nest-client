"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import { PostGridType } from "@/types/PostType";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";
import htmlTruncate from "html-truncate";
import { formatDate } from "@/utils/formatDate";

interface ArticleGridProps {
  article: PostGridType;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ article }) => {
  const router = useRouter();
  const maxLength = 100;
  const decodedContent = decodeURIComponent(article.content);
  const truncatedHtmlString = htmlTruncate(decodedContent, maxLength) + "...";
  const truncatedHtml = parse(truncatedHtmlString);
  const formattedDate = formatDate(article.createdAt);

  return (
    <div
      className="flex cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-100 transition-all duration-200 rounded-lg w-full group"
      onClick={() => router.push(`/curated-articles/${article.id}`)}
    >
      <div className="w-20 h-20 bg-gray-100 flex-shrink-0 mr-4 rounded-md overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            width={80}
            height={80}
            className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.viewCount} views</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          By{" "}
          <span className="font-medium">
            {article.memberUsername || "Unknown"}
          </span>
        </p>

        {article.tagNames && article.tagNames.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {article.tagNames.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-gray-600 break-words py-2">{truncatedHtml}</div>
      </div>
    </div>
  );
};

export default ArticleGrid;
