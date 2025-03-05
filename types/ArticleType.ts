export type ArticleType = {
  author?: string;
  title: string;
  content: string;
  tags: string[];
  image: File | string | null;
  imagePreview?: string | null;
};
