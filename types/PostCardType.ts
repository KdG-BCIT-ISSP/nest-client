export type PostCardType = {
  id?: number;
  saved?: boolean;
  className?: string;
  title?: string;
  content?: string;
  tags?: string[];
  imageBase64?: string[];
  author?: string;
  timestamp?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  postImage?: string;
};
