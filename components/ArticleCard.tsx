import { ArticleType } from "@/types/ArticleType";
import React from "react";

interface ArticleCardProps {
    article: ArticleType; 
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const maxLength = 100;
    return (
        <a href={article.link || "#"} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img
                className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                src={article.coverImage || "/default-image.jpg"}
                alt={article.title}
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {article.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{
                    __html: article.content.slice(0, maxLength) + (article.content.length > maxLength ? '...' : ''),
                }}>
                    {/* {article.content.length > maxLength
                        ? `${article.content.slice(0, maxLength)}...`
                        : article.content} */}
                </p>
            </div>
        </a>
    );
}
