"use client";

import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/api/article/delete/route";
import { ArticleCardType } from "@/types/ArticleCardType";
import React, { useCallback } from "react";
import Image from "next/image";
import { postView } from "@/app/api/content/view/route";

interface ArticleCardProps {
  article: ArticleCardType;
  onDelete: (id: number) => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const router = useRouter();
  const cleanContent = article.content.replace(/<[^>]*>/g, "");
  const maxLength = 100;

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deleteArticle(article.id);
      onDelete(article.id);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleClick = useCallback(() => {
    postView(article.id).catch((error) =>
      console.error("Error posting view:", error)
    );
    router.push(`/curated-articles/${article.id}`);
  }, [article.id, router]);

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
    >
      {/* Cover Image */}
      <div className="md:w-48">
        <Image
          className="object-cover w-full h-full rounded-t-lg md:rounded-none"
          src={article.coverImage || "/images/pregnancy1.jpg"}
          alt={article.title}
          width={60}
          height={60}
        />
      </div>

      {/* Article Details */}
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>
        <p className="mb-3 font-small text-gray-700 dark:text-gray-400 overflow-hidden">
          {cleanContent.length > maxLength
            ? `${cleanContent.slice(0, maxLength)}...`
            : cleanContent}
        </p>

        {/* Metadata: Topic, Created At, Stats */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-medium text-gray-800">{article.topicName}</span>{" "}
          • <span>{article.createdAt}</span>
        </div>

        {/* Tags */}
        {article.tagNames?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {article.tagNames.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-xs px-2 py-1 rounded-full text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Likes, Views, Shares */}
        <div className="flex justify-between text-gray-600 dark:text-gray-300 text-xs">
          <span>{article.likesCount ?? 0} Likes</span>
          <span>{article.viewCount ?? 0} Views</span>
          <span>{article.shareCount ?? 0} Shares</span>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 border-2 border-red-500 w-20 p-1 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
