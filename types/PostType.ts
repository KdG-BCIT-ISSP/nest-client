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
