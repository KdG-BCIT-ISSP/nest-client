export type CardType = {
  id: number;
  header: string;
  content: string;
  likes: number;
  comments: number;
  type: "curated-articles" | "posts";
};
