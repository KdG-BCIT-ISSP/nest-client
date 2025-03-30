"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { ArticleCardType } from "@/types/ArticleCardType";
import React, { useCallback } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import htmlTruncate from "html-truncate";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { del, post } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "next-i18next";

interface ArticleCardProps {
  article: ArticleCardType;
  onDelete?: (id: number) => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const { t } = useTranslation("article");
  const router = useRouter();
  const maxLength = 50;
  const [userData] = useAtom(userAtom);
  const truncatedHtmlString = htmlTruncate(article.content, maxLength) + "...";
  const truncatedHtml = parse(truncatedHtmlString);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!confirm(t("article.confirmDelete"))) return;

    try {
      await del(`/api/article/${article.id}`);
      onDelete?.(article.id);
      alert(t("article.deletedSuccess"));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleClick = useCallback(() => {
    post(`/api/content/${article.id}/view`, { id: article.id });
    router.push(`/curated-articles/${article.id}`);
  }, [article.id, router]);

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white md:flex-row md:max-w-2xl hover:bg-lightGray cursor-pointer"
    >
      {/* Cover Image */}
      <div className="md:w-80 h-48 md:h-auto relative">
        <Image
          className="object-cover w-full h-full rounded-t-lg md:rounded-none"
          src={article.coverImage || "/images/pregnancy1.jpg"}
          alt={article.title}
          width={80}
          height={60}
        />
      </div>

      {/* Article Details */}
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-2">
          {article.title}
        </h5>
        {/* <div
          className="text-gray-800 overflow-hidden"
          style={{ maxHeight: "5rem" }}
        >
          {truncatedHtml}
        </div> */}

        {/* Metadata: Topic, Created At, Stats */}
        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium text-gray-800">{article.topicName}</span>{" "}
          • <span>{formatDate(article.createdAt ?? "")}</span>
        </div>

        {/* Tags */}
        {article.tagNames?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {article.tagNames.map((tag) => (
              <span
                key={tag}
                className="bg-primary text-xs px-2 py-1 rounded-md text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Likes, Views, Shares */}
        <div className="flex justify-between text-gray-600 text-xs">
          <span>
            {article.likesCount ?? 0} {t("article.likes")}
          </span>
          <span>
            {article.viewCount ?? 0} {t("article.views")}
          </span>
          <span>
            {article.shareCount ?? 0} {t("article.shares")}
          </span>
        </div>

        {/* Delete Button */}
        {(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") && (
          <div className="flex justify-end mt-2">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 border-2 border-red-500 w-20 p-1 rounded-md"
            >
              {t("article.delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
