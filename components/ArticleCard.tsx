import { deleteArticle } from "@/app/api/article/delete/route";
import { ArticleTypeWithID } from "@/types/ArticleTypeWithID";
import React from "react";

interface ArticleCardProps {
  article: ArticleTypeWithID;
  onDelete: (id: number) => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const cleanContent = article.content.replace(/<[^>]*>/g, "");
  const maxLength = 100;

  const handleDelete = async () => {
    try {
      await deleteArticle(article.id);
      onDelete(article.id);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none"
        src={article.coverImage || "/images/pregnancy1.jpg"}
        alt={article.title}
      />
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>
        <p className="mb-3 font-small text-gray-700 dark:text-gray-400">
          {cleanContent.length > maxLength
            ? `${cleanContent.slice(0, maxLength)}...`
            : cleanContent}
        </p>
        <div className="flex justify-end">
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
