export type ArticleType = {
  id?: number;
  author?: string;
  memberUsername?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  tagNames: string[];
  coverImage: string;
  imagePreview?: string | null;
  link?: string;
  likes: number;
  isLiked: boolean;
};
