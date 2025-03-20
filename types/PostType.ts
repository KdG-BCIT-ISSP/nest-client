export type PostType = {
  id: number;
  title?: string;
  content?: string;
  type?: string;
  topicId: number;
  tagNames?: string[];
  memberUsername?: string;
  memberId?: number;
  memberAvatar?: string[];
  comment?: string[];
  createdAt?: string;
  imageBase64?: string[];
  bookmarked?: boolean;
  liked?: boolean;
  saved?: boolean;
  className?: string;
  images?: string;
  postImage?: string;
  likesCount?: number;
  viewCount?: number;
  shareCount?: number;
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
  memberUsername: string;
  memberAvatar: string;
  createdAt: string;
  likesCount: number;
  imageBase64: string;
  coverImage?: string;
  tagNames: string[];
  topic: string;
  viewCount: number;
  shareCount: number;
  comments?: string;
  comment: [];
  liked: boolean;
  bookmarked: boolean;
  onDelete?: () => void;
};
