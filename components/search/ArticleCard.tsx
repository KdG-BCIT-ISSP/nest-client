"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { ArticleCardType } from "@/types/ArticleCardType";
import React, { useCallback } from "react";
import Image from "next/image";
import { post } from "@/app/lib/fetchInterceptor";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "next-i18next";

interface ArticleCardProps {
  article: ArticleCardType;
  onDelete?: (id: number) => void;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { t } = useTranslation("article");
  const router = useRouter();

  const handleClick = useCallback(() => {
    post(`/api/content/${article.id}/view`, { id: article.id });
    router.push(`/curated-articles/${article.id}`);
  }, [article.id, router]);

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white md:flex-row hover:bg-lightGray cursor-pointer"
    >
      <div className="md:w-80 h-48 md:h-auto relative">
        <Image
          className="object-cover w-full h-full rounded-t-lg md:rounded-none"
          src={article.coverImage || "/images/pregnancy1.jpg"}
          alt={article.title}
          width={80}
          height={60}
        />
      </div>

      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-2">
          {article.title}
        </h5>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium text-gray-800">{article.topicName}</span>{" "}
          • <span>{formatDate(article.createdAt ?? "")}</span>
        </div>

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

        <div className="flex justify-between text-gray-600 text-xs">
          <span>
            {article.likesCount ?? 0} {t("article.likes")}
          </span>
          <span>
            {article.viewCount ?? 0} {t("article.views")}
          </span>
          <span>
            {article.bookmarkCount ?? 0} {t("article.saves")}
          </span>
        </div>
      </div>
    </div>
  );
}
