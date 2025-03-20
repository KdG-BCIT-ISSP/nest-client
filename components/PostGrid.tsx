"use client";

import { PostGridType } from "@/types/PostType";
import ThumbsUp from "@/public/svg/Article/ThumbsUp";
import Bookmark from "@/public/svg/Article/Bookmark";
import Share from "@/public/svg/Article/Share";
import Comments from "@/public/svg/Article/Comment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";

type PostGridProps = {
  post: PostGridType;
};

export default function PostGrid({ post }: PostGridProps) {
  const router = useRouter();
  const formattedDate = formatDate(post.createdAt);
  const hashtags = post.tagNames.map((tag) => `#${tag}`).join(" ");

  return (
    <div className="bg-white rounded-lg shadow-md w-full mx-auto mb-4 text-gray-800 border-2">
      <div className="p-3">
        <div className="font-semibold text-sm">{post.title}</div>
        <div className="text-xs text-gray-600">By: {post.memberUsername}</div>
      </div>

      <div className="w-full h-auto relative">
        <Image
          src={post.imageBase64[0]}
          alt={post.title}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto object-cover cursor-pointer"
          onClick={() => router.push(`/posts/${post.id}`)}
        />
      </div>

      <div className="flex items-center p-3 space-x-4">
        <button>
          <ThumbsUp count={post.likesCount} isLiked={post.liked} />
        </button>
        <button>
          <Comments count={post.comments ? parseInt(post.comments) : 0} />
        </button>
        <button>
          <Bookmark count={4} />
        </button>
        <button>
          <Share count={8} />
        </button>
      </div>

      <div className="px-3 py-2 text-sm break-words">
        <span className="font-semibold">{post.memberUsername}</span>{" "}
        <span>{post.content}</span>{" "}
        <span className="text-blue-500">{hashtags}</span>
      </div>

      <div className="px-3 text-sm text-gray-500 cursor-pointer">
        View all comments
      </div>

      <div className="px-3 py-2 text-xs text-gray-400">{formattedDate}</div>
    </div>
  );
}
