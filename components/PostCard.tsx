import React, { useCallback, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";
import Share from "@/public/svg/Post/Share";
import { PostCardType } from "@/types/PostCardType";
import BookmarkToggle from "../components/Bookmark";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { del, post } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";

export default function PostCard({
  id,
  className,
  title,
  content,
  tags = [],
  imageBase64 = [],
  author,
  createdAt,
  isBookmarked = false,
  isLiked = false,
  likesCount = 0,
  viewCount = 0,
  shareCount = 0,
  onDelete,
}: PostCardType & { onDelete?: (id: number) => void }) {
  const { t } = useTranslation("post");
  const displayTitle = title || t("post.untitled");
  const displayContent = content || t("post.noContent");
  const displayAuthor = author || t("post.anonymous");
  const displayDate = createdAt || t("post.unknownDate");

  const router = useRouter();
  const [userData] = useAtom(userAtom);
  const [upvoteCount, setUpvoteCount] = useState(likesCount);
  const [userLiked, setUserLiked] = useState(isLiked);

  const handleUpvote = () => {
    setUserLiked(true);
    setUpvoteCount((prev) => prev + 1);
  };

  const handleDownvote = () => {
    setUserLiked(false);
    setUpvoteCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!confirm(t("post.confirmDelete"))) return;

    try {
      await del(`/api/posts/${id}`);
      onDelete?.(id);
      alert(t("post.deletedSuccess"));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleClick = useCallback(() => {
    if (id) {
      post(`/api/content/${id}/view`, { id: id });
      router.push(`/posts/${id}`);
    }
  }, [id, router]);

  return (
    <div
      className={clsx(
        "border rounded-md relative mx-auto p-4 shadow-md w-full cursor-pointer bg-container",
        className
      )}
    >
      {/* Mobile View */}
      <div className="block sm:hidden">
        {imageBase64.length > 0 && (
          <div className="flex flex-wrap">
            {imageBase64.map((base64, index) => (
              <div
                key={index}
                className="w-full h-52 mb-3 relative overflow-hidden rounded-sm border border-gray-300"
              >
                <Image
                  src={base64}
                  alt={`Post Image ${index}`}
                  fill
                  className="object-cover"
                  unoptimized
                  onClick={handleClick}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          {/* Upvote and Downvote Buttons */}
          <div className="flex flex-col items-center text-gray-500">
            <button
              className={`p-1 ${userLiked ? "text-cyan-500" : "text-gray-400"} hover:text-cyan-500`}
              onClick={handleUpvote}
            >
              ▲
            </button>
            <span className="font-bold text-gray-800">{upvoteCount}</span>
            <button
              className="p-1 text-gray-400 hover:text-red-500"
              onClick={handleDownvote}
            >
              ▼
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              {displayTitle}
            </h1>
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {displayContent}
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <div>

                <span className="font-medium text-gray-800">{displayAuthor}</span>{" "}
                • <span>{displayDate}</span>
              </div>

              <div className="mt-4 flex justify-between text-gray-500 text-sm">
                <button className="hover:text-cyan-600">
                  <ThumbsUp count={upvoteCount} filled={userLiked} />
                </button>
                <button className="hover:text-cyan-600">
                  <Comments count={234} container />
                </button>
              </div>

            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* View Count & Share Count */}
            <div className="flex justify-between text-gray-500 mt-2">
              <span>
                {viewCount} {t("post.views")}
              </span>
              <span>
                {shareCount} {t("post.shares")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex gap-4">
        <div className="flex flex-col items-center text-gray-500">
          <button
            className={`p-1 ${userLiked ? "text-cyan-500" : "text-gray-400"} hover:text-cyan-500`}
            onClick={handleUpvote}
          >
            ▲
          </button>
          <span className="font-bold text-gray-800">{upvoteCount}</span>
          <button
            className="p-1 text-gray-400 hover:text-red-500"
            onClick={handleDownvote}
          >
            ▼
          </button>
        </div>
        <div className="flex-1 flex flex-col p-2">
          <div className="text-sm text-gray-500 mb-2">
            {imageBase64.length > 0 && (
              <div className="flex flex-wrap">
                <div className="relative w-72 h-auto aspect-[16/9] overflow-hidden rounded-sm border border-gray-300">
                  <Image
                    src={imageBase64[0]}
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
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
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
              src={"/images/default_profile_image.png"}
              alt="User profile"
              width={70}
              height={70}
              priority
              />

            <div className="flex flex-col">

              <span className="font-medium text-gray-800">{displayAuthor}</span>
              <span className="text-darkGray">{displayDate}</span>

            </div>
              </div>
            <div className="mt-4 flex justify-between text-gray-500 text-sm">
              <button className="hover:text-cyan-600">
                <ThumbsUp count={upvoteCount} filled={userLiked} />
              </button>
              <button className="hover:text-cyan-600 ml-4">
                <Comments count={234} container />
              </button>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
