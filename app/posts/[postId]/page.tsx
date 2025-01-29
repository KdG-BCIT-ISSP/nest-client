import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId;

  return <div>Post Detail Page for ID: {postId}</div>;
}
