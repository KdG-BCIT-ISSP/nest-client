export type ArticleType = {
  id: number;
  memberUsername?: string;
  title: string;
  content: string;
  type: string;
  topicName?: string;
  tagNames: string[];
  coverImage: string;
  createdAt?: string;
  likes?: number;
  isLiked?: boolean;
  bookmarked?: boolean;
  comment?: Comment[];
  viewCount?: number;
  shareCount?: number;
  memberId?: number;
  memberAvatar?: string;
};
