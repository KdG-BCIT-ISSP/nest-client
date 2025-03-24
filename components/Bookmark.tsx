import { SvgPost } from "@/types/SvgPost";
import { useState, useEffect } from "react";
import Bookmark from "../public/svg/Post/Bookmark";
import { put } from "@/app/lib/fetchInterceptor";

export default function BookmarkToggle({
  count,
  onClick,
  post,
  container,
  filled = false,
  postId,
}: SvgPost) {
  const [isBookmarked, setIsBookmarked] = useState(filled);

  useEffect(() => {
    setIsBookmarked(filled);
  }, [filled]);

  const handleBookmarkToggle = async () => {
    try {
      if (typeof postId === "number") {
        await put(`/api/content/${postId}/toggleBookmark`, {});
        setIsBookmarked(!isBookmarked);
        if (onClick) {
          onClick();
        }
      } else {
        console.error("Invalid postId:", postId);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  return (
    <Bookmark
      count={count}
      onClick={handleBookmarkToggle}
      post={post}
      container={container}
      filled={isBookmarked}
      postId={postId}
    />
  );
}
