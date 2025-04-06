import React from "react";
import {
  ThumbsUpIcon,
  BookmarkIcon,
  Share2Icon,
  MessageCircleIcon,
} from "lucide-react";

interface LikeProps {
  count: number;
  isLiked?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  search?: boolean;
}

export const Like: React.FC<LikeProps> = ({
  count,
  isLiked,
  onClick,
  disabled = false,
  search,
}) => {
  return (
    <button
      className={`flex items-center gap-1 transition-colors ${
        disabled ? "cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <ThumbsUpIcon
        size={search ? 14 : 22}
        color={"#CD6A6A"}
        fill={isLiked && !disabled ? "#CD6A6A" : "none"}
      />
      <span className={`text-lg ml-1 font-bold text-[#CD6A6A]`}>{count}</span>
    </button>
  );
};

// Comments Component
interface CommentsProps {
  count: number;
  search?: boolean;
}

export const Comments: React.FC<CommentsProps> = ({ count, search }) => {
  return (
    <div className="flex items-center gap-1 text-gray-600">
      <MessageCircleIcon size={search ? 14 : 22} color="#CD6A6A" />
      <span className="text-lg ml-1 font-bold text-[#CD6A6A]">{count}</span>
    </div>
  );
};

interface BookmarkProps {
  count: number;
  isSaved?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  search?: boolean;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  count,
  isSaved,
  onClick,
  disabled = false,
  search,
}) => {
  return (
    <button
      className={`flex items-center gap-1 transition-colors ${
        disabled ? "cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <BookmarkIcon
        size={search ? 14 : 22}
        color={"#CD6A6A"}
        fill={isSaved && !disabled ? "#CD6A6A" : "none"}
      />
      <span className={`text-lg ml-1 font-bold text-[#CD6A6A]`}>{count}</span>
    </button>
  );
};

interface ShareProps {
  onClick?: () => void;
  search?: boolean;
}

export const Share: React.FC<ShareProps> = ({ onClick, search }) => {
  return (
    <button
      className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
      onClick={onClick}
    >
      <Share2Icon size={search ? 14 : 22} color="#CD6A6A" />
    </button>
  );
};
