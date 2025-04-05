"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import { PostCardType } from "@/types/PostCardType";
import { useRouter } from "next/navigation";
import { post } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import { Like, Comments } from "../Icons";
import { formatDate } from "@/utils/formatDate";
import { trimContent } from "@/utils/trimContent";

export default function PostCard({
  postData,
  // onDelete,
}: PostCardType & { onDelete?: (id: number) => void }) {
  const { t } = useTranslation("post");
  const displayTitle = postData.title || t("post.untitled");
  const displayContent =
    trimContent(postData.content || "", 30) || t("post.noContent");
  const displayAuthor = postData.memberUsername || t("post.anonymous");
  const displayDate =
    formatDate(postData.createdAt ?? "") || t("post.unknownDate");

  const router = useRouter();

  const id = postData.id;

  const handleClick = useCallback(() => {
    if (id) {
      post(`/api/content/${id}/view`, { id: id });
      router.push(`/posts/${id}`);
    }
  }, [id, router]);

  return (
    <div
      className={clsx(
        "border rounded-md relative mx-auto p-4 shadow-md w-full cursor-pointer bg-container"
      )}
      onClick={handleClick}
    >
      <div className="block sm:hidden">
        {postData.imageBase64.length > 0 && (
          <div className="flex flex-wrap">
            <div className="w-full h-52 mb-3 relative overflow-hidden rounded-sm border border-gray-300">
              <Image
                src={postData.imageBase64[0]}
                alt={`Post Image `}
                fill
                className="object-cover"
                unoptimized
                onClick={handleClick}
              />
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              {displayTitle}
            </h1>
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {displayContent}
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <div>
                <span className="font-medium text-gray-800">
                  {displayAuthor}
                </span>{" "}
                • <span>{displayDate}</span>
              </div>

              <div className="mt-4 gap-4 flex justify-between text-gray-500 text-sm">
                <Like count={1} isLiked={postData.liked} />
                <Comments count={234} />
              </div>
            </div>
            {(postData.tagNames || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(postData.tagNames || []).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between text-gray-500 mt-2">
              <span>
                {postData.viewCount} {t("post.views")}
              </span>
              <span>
                {postData.bookmarkCount} {t("post.saves")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex gap-4" onClick={handleClick}>
        <div className="flex-1 flex flex-col p-2">
          <div className="text-sm text-gray-500 mb-2">
            {postData.imageBase64.length > 0 && (
              <div className="flex flex-wrap">
                <div className="relative w-72 h-auto aspect-[16/9] overflow-hidden rounded-sm border border-gray-300">
                  <Image
                    src={postData.imageBase64[0]}
                    alt={`Post Image `}
                    fill
                    className="object-cover"
                    unoptimized
                    onClick={handleClick}
                  />
                </div>
              </div>
            )}
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2  line-clamp-2">
            {displayTitle}
          </h1>
          <p className="text-base text-gray-700 whitespace-pre-wrap mb-4 line-clamp-5">
            {displayContent}
          </p>
          {(postData.tagNames || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(postData.tagNames || []).map((tag) => (
                <span
                  key={tag}
                  className="bg-primary text-sm px-3 py-1 rounded-md text-darkGray"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4 justify-between">
            <div className="flex justify-start items-center">
              <Image
                className="w-8 h-8 rounded-full mr-2"
                src={
                  (Array.isArray(postData.memberAvatar)
                    ? postData.memberAvatar[0]
                    : postData.memberAvatar) ||
                  "/images/default_profile_image.png"
                }
                alt="User profile"
                width={70}
                height={70}
                priority
              />

              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {displayAuthor}
                </span>
                <span className="text-darkGray">{displayDate}</span>
              </div>
            </div>
            <div className="mt-4 gap-4  flex justify-between text-gray-500 text-sm">
              <Like count={postData.likesCount || 0} isLiked={postData.liked} />
              <Comments count={postData.comment?.length || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
