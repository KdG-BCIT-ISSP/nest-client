export type ArticleTypeWithID = {
  id: number;
  author?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  tagNames: string[];
  coverImage: string;
  imagePreview?: string | null;
  link?: string;
};
