import React, { useCallback, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import ThumbsUp from "@/public/svg/Post/ThumbsUp";
import Comments from "@/public/svg/Post/Comment";
import Share from "@/public/svg/Post/Share";
import { PostCardType } from "@/types/PostCardType";
import BookmarkToggle from "../components/Bookmark";
import { useRouter } from "next/navigation";
import { postView } from "@/app/api/content/view/route";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { deletePost } from "@/app/api/post/delete/route";

export default function PostCard({
  id,
  className,
  title = "Untitled Post",
  content = "No content available.",
  tags = [],
  imageBase64 = [],
  author = "Anonymous",
  createdAt = "Unknown date",
  isBookmarked = false,
  isLiked = false,
  likesCount = 0,
  viewCount = 0,
  shareCount = 0,
  onDelete,
}: PostCardType & { onDelete: (id: number) => void }) {
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

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      onDelete(id);
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleClick = useCallback(() => {
    if (id) {
      postView(id).catch((error) =>
        console.error("Error posting view:", error)
      );
      router.push(`/posts/${id}`);
    }
  }, [id, router]);

  return (
    <div
      className={clsx(
        "border rounded-md relative mx-auto my-6 p-4 shadow-md w-full cursor-pointer",
        className
      )}
      onClick={handleClick}
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
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-800">{author}</span> •{" "}
              <span>{createdAt}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
              {content}
            </p>
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
            <div className="mt-4 flex justify-between text-gray-500 text-sm">
              <button className="hover:text-cyan-600">
                <ThumbsUp count={upvoteCount} filled={userLiked} />
              </button>
              <button className="hover:text-cyan-600">
                <Comments count={234} container />
              </button>
              <button className="hover:text-cyan-600">
                <BookmarkToggle count={32} postId={id} filled={isBookmarked} />
              </button>
              <button className="hover:text-cyan-600">
                <Share />
              </button>
            </div>
            {/* View Count & Share Count */}
            <div className="flex justify-between text-gray-500 mt-2">
              <span>{viewCount} Views</span>
              <span>{shareCount} Shares</span>
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
        <div className="flex-1 flex flex-col">
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium text-gray-800">{author}</span> •{" "}
            <span>{createdAt}</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-base text-gray-700 whitespace-pre-wrap mb-4">
            {content}
          </p>
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
          <div className="mt-4 flex justify-between text-gray-500 text-sm">
            <button className="hover:text-cyan-600">
              <ThumbsUp count={upvoteCount} filled={userLiked} />
            </button>
            <button className="hover:text-cyan-600">
              <Comments count={234} container />
            </button>
            <button className="hover:text-cyan-600">
              <BookmarkToggle count={32} postId={id} filled={isBookmarked} />
            </button>
            <button className="hover:text-cyan-600">
              <Share />
            </button>
          </div>
          {/* View Count & Share Count */}
          <div className="flex justify-between text-gray-500 mt-2">
            <span>{viewCount} Views</span>
            <span>{shareCount} Shares</span>
          </div>
        </div>
        {imageBase64.length > 0 && (
          <div className="flex flex-wrap">
            <div className="relative w-72 h-auto aspect-[16/9] overflow-hidden rounded-sm border border-gray-300">
              <Image
                src={imageBase64[0]}
                alt={`Post Image `}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
      {/* Show Delete Button Only for ADMIN or SUPER_ADMIN */}
      {(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") && (
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 border-2 border-red-500 w-20 p-1 rounded-md"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
