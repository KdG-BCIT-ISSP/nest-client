export type ArticleTypeWithID = {
  id: number;
  memberUsername?: string;
  memberAvatar?: string;
  title: string;
  content: string;
  type: string;
  topicId: number;
  topicName: string;
  tagNames: string[];
  coverImage: string;
  imagePreview?: string | null;
  link?: string;
};
