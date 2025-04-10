export type ArticleCardType = {
  id: number;
  memberUsername?: string;
  memberAvatar?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  topicName: string;
  tagNames: string[];
  coverImage: string;
  imagePreview?: string | null;
  link?: string;
  viewCount?: number;
  shareCount?: number;
  likesCount?: number;
  bookmarkCount?: number;
  createdAt?: string;
  comment?: {
    id: number;
    content: string;
    createdAt: string;
    memberUsername: string;
    memberAvatar: string;
    likesCount: number;
    isLiked: boolean;
  }[];
};
