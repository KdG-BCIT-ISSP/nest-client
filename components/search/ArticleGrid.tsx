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
  const MAX_LENGTH = 100;

  const decodedContent = decodeURIComponent(article.content);
  const truncatedHtmlString = `${htmlTruncate(decodedContent, MAX_LENGTH)}...`;
  const truncatedHtml = parse(truncatedHtmlString);
  const formattedDate = formatDate(article.createdAt);

  const handleClick = () => {
    router.push(`/curated-articles/${article.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative h-56 w-full bg-gray-100">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <span>{formattedDate}</span>
          <span>{article.viewCount} views</span>
        </div>

        <h2 className="mt-2 text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
          {article.title}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          By{" "}
          <span className="font-medium">
            {article.memberUsername || "Unknown"}
          </span>
        </p>

        {article.tagNames && article.tagNames.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {article.tagNames.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 text-gray-700 text-sm leading-6 line-clamp-3">
          {truncatedHtml}
        </div>
      </div>
    </div>
  );
};

export default ArticleGrid;
