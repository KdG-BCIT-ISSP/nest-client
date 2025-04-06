export interface Comment {
  id: number;
  userName: string;
  memberId: number;
  memberAvatar: {
    image: string;
  };
  content: string;
  createAt: string;
  parentId: number | null;
  postId: number;
  replies: Comment[];
  likesCount?: number;
  liked?: boolean;
}
export interface BaseContent {
  id: number;
  title: string;
  content: string;
  memberUsername: string;
  comment?: Comment[];
  createdAt?: string;
  tagNames?: string[];
  liked?: boolean;
  bookmarked?: boolean;
  bookmarkCount?: number;
  viewCount?: number;
  topicId?: number;
  shareCount?: number;
  memberAvatar?: string;
  imageBase64?: string[];
}

export interface ArticleType extends BaseContent {
  id: number;
  type: string;
  coverImage: string;
  likes?: number;
  isLiked?: boolean;
  topicName?: string;
  memberId?: number;
  topicId?: number;
  imagePreview?: string;
}

export interface PostType extends BaseContent {
  type: string;
  memberId?: number;
  imageBase64?: string[];
  liked?: boolean;
  comment?: Comment[];
  className?: string;
  images?: string;
  postImage?: string;
  likesCount?: number;
}

export type ContentType = ArticleType | PostType;
