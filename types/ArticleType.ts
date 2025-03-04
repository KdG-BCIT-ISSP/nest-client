export type ArticleType = {
  author?: string;
  title: string;
  content: string;
  image: File | string | null;
  imagePreview?: string | null;
};
