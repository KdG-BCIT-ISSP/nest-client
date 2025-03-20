export type PostCardType = {
  id: number;
  title?: string;
  content?: string;
  tags?: string[];
  imageBase64?: string[];
  author?: string;
  createdAt?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  postImage?: string;
  saved?: boolean;
  className?: string;
  likesCount?: number;
  viewCount?: number;
  shareCount?: number;
};
