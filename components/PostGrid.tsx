import { PostGridType } from "@/types/PostType";
import ThumbsUp from "@/public/svg/Article/ThumbsUp";
import Bookmark from "@/public/svg/Article/Bookmark";
import Share from "@/public/svg/Article/Share";
import Comments from "@/public/svg/Article/Comment";
import Image from "next/image";
import { useRouter } from "next/navigation";

type PostGridProps = {
  post: PostGridType;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function PostGrid({ post }: PostGridProps) {
  const router = useRouter();
  const formattedDate = formatDate(post.createdAt);
  const hashtags = post.tags.map((tag) => `#${tag}`).join(" ");

  return (
    <div className="bg-white rounded-lg shadow-md w-full mx-auto mb-4 text-gray-800">
      {/* Header */}
      <div className="p-3">
        <div className="font-semibold text-sm">{post.title}</div>
        <div className="text-xs text-gray-600">By: {post.creatorName}</div>
      </div>

      {/* Image */}
      <div className="w-full h-auto">
        {post.postImage && (
          <Image
            src={`data:image/png;base64,${post.postImage}`}
            alt={post.title}
            width={0} // Set to 0 to allow dynamic sizing
            height={0} // Set to 0 to allow dynamic sizing
            sizes="100vw" // Ensures the image scales responsively
            className="w-full h-auto object-cover cursor-pointer"
            onClick={() => router.push(`/posts/${post.id}`)}
          />
        )}
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center p-3 space-x-4">
        <button>
          <ThumbsUp count={post.likesCount} />
        </button>
        <button>
          <Comments count={2} />
        </button>
        <button>
          <Bookmark count={2} />
        </button>
        <button>
          <Share count={8} />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-2 text-sm break-words">
        <span className="font-semibold">{post.creatorName}</span>{" "}
        <span>{post.content}</span>{" "}
        <span className="text-blue-500">{hashtags}</span>
      </div>

      {/* Comments Link */}
      <div className="px-3 text-sm text-gray-500 cursor-pointer">
        View all comments
      </div>

      {/* Date */}
      <div className="px-3 py-2 text-xs text-gray-400">{formattedDate}</div>
    </div>
  );
}
