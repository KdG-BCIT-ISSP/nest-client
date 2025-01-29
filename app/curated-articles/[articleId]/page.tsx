import { useParams } from "next/navigation";

export default function ArticleDetailsPage() {
  const params = useParams();
  const articleId = params.articleId;

  return <div>Article Detail Page for ID: {articleId}</div>;
}
