"use client";

import { useState, useEffect } from "react";
import { getArticle } from "@/app/api/article/get/route";
import { ArticleCardType } from "@/types/ArticleCardType";
import ArticleCard from "@/components/ArticleCard";

export default function TopArticles({
  limit = 3,
  sortBy,
  title,
}: {
  limit?: number;
  sortBy?: keyof ArticleCardType;
  title: string;
}) {
  const [allArticles, setAllArticles] = useState<ArticleCardType[]>([]);
  const [topArticles, setTopArticles] = useState<ArticleCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const articles = await getArticle();
        setAllArticles(articles);
        console.log(articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    if (allArticles.length > 0 && sortBy) {
      const sortedArticles = [...allArticles]
        .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
        .slice(0, limit);
      setTopArticles(sortedArticles);
    }
  }, [allArticles, limit, sortBy]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid gap-4">
        {topArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={(id) =>
              setTopArticles((prev) => prev.filter((a) => a.id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
