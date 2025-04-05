export interface ReportCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    coverImage: string;
  };
  reports: Array<{
    id: number;
    reason: string;
    createdAt: string;
  }>;
  isPost?: boolean;
}
