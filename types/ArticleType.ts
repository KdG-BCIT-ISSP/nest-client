export type ArticleType = {
  author: string;
  title: string;
  content: string;
  image: File | null;
  imagePreview?: string | null;
};
