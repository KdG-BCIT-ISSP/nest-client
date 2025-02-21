export type PostType = {
  id?: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  author?: string;
  timestamp?: string;
  images?: File[];
  coverImage: string;
};
