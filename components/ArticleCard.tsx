"use client";

import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/api/article/delete/route";
import { ArticleTypeWithID } from "@/types/ArticleTypeWithID";
import React, { useCallback } from "react";
import Image from "next/image";
import { postView } from "@/app/api/content/view/route";
import parse from "html-react-parser";
import htmlTruncate from "html-truncate";

interface ArticleCardProps {
  article: ArticleTypeWithID;
  onDelete: (id: number) => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const router = useRouter();
  const maxLength = 50;

  const truncatedHtmlString = htmlTruncate(article.content, maxLength) + "...";
  const truncatedHtml = parse(truncatedHtmlString);

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
      <div className="md:w-48">
        <Image
          className="object-cover w-full h-full rounded-t-lg md:rounded-none"
          src={article.coverImage || "/images/pregnancy1.jpg"}
          alt={article.title}
          width={60}
          height={60}
        />
      </div>
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>

        <div
          className="text-gray-800 overflow-hidden"
          style={{ maxHeight: "5rem" }}
        >
          {truncatedHtml}
        </div>

        <div className="flex justify-end pt-4">
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
