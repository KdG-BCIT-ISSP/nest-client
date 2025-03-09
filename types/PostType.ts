export type PostType = {
  saved?: boolean;
  className?: string;
  id?: string;
  title: string;
  content: string;
  type?: string;
  topicId: number;
  tags: string[];
  author?: string;
  timestamp?: string;
  images?: string;
  postImages: string[];
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
