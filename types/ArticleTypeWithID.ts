export type ArticleTypeWithID = {
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
};

export type ArticleGridType = {
  id: number;
  title: string;
  content: string;
  creatorName: string;
  createdAt: string;
  likesCount: number;
  coverImage?: string;
  postImage: string;
  tags: string[];
  topic: string;
  viewCount: number;
  shareCount: number;
  comments?: string;
};
