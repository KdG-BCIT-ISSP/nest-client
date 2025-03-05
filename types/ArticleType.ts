export type ArticleType = {
  author?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  tags: string[];
  image: string;
  imagePreview?: string | null;
};
