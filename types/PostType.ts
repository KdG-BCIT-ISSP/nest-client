export type PostType = {
  id?: number;
  title?: string;
  content?: string;
  type?: string;
  topicId: number;
  tagNames?: string[];
  memberUsername?: string;
  timestamp?: string;
  imageBase64?: string[];
  bookmarked?: boolean;
  liked?: boolean;
  saved?: boolean;
  className?: string;
  images?: string;
  postImage?: string;
};

export type ReportPostType = {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  coverImage: string;
};

export interface Report {
  postId: number;
  commentId?: number;
  id: number;
  reason: string;
  createdAt: string;
}

export type PostGridType = {
  id: number;
  title: string;
  content: string;
  creatorName: string;
  createdAt: string;
  likesCount: number;
  postImage: string;
  tags: string[];
  topic: string;
  viewCount: number;
  shareCount: number;
  comments?: string;
  onDelete?: () => void;
};
