"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ArticleCardType } from "@/types/ArticleCardType";
import ArticleCard from "@/components/search/ArticleCard";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "../Loader";
import Pagination from "../Pagination";

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

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await get(
          `/api/article?page=${currentPage}&size=${pageSize}`
        );
        const updatedArticles = data.content.map(
          (article: ArticleCardType) => ({
            ...article,
            content: decodeURIComponent(article.content),
          })
        );
        setAllArticles(updatedArticles);
        setTotalPages(data.page.totalPages);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [currentPage]);

  useEffect(() => {
    if (allArticles.length > 0 && sortBy) {
      const sortedArticles = [...allArticles]
        .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
        .slice(0, limit);
      setTopArticles(sortedArticles);
    }
  }, [allArticles, limit, sortBy]);

  if (loading) {
    return <Loader />;
  }

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
