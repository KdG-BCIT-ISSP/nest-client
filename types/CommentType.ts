export type CommentType = {
  id: string;
  author: string;
  content: string;
  replies?: CommentType[];
};
