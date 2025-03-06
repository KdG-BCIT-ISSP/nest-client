export type PostType = {
  saved?: boolean;
  className?: string;
  id?: string;
  title: string;
  content: string;
  type?: string;
  topicId: number;
  tags: string[];
  author?: string;
  timestamp?: string;
  images?: string;
  postImages: string[];
};
