"use client";

import ArticleCard from "@/components/ArticleCard";
import { useEffect, useState } from "react";
import { getArticle } from "@/app/api/article/get/route";
import { ArticleTypeWithID } from "@/types/ArticleTypeWithID";

export default function CuratedArticlesPage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleTypeWithID[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticle();
        const updatedArticles = data.map((article: ArticleTypeWithID) => ({
          ...article,
          content: decodeURIComponent(article.content), // If needed, process content here
        }));
        setArticles(updatedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleDelete = (id: number) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Curated Articles Page
      </h1>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
