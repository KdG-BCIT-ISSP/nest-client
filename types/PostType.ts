export type PostType = {
  id?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  tags: string[];
  author?: string;
  timestamp?: string;
  images?: File[];
  postImages: string[];
};
