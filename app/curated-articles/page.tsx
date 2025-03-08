"use client";

import ArticleCard from "@/components/ArticleCard";
import { useEffect, useState } from "react";
import { getArticle } from "@/app/api/article/get/route";
import { ArticleTypeWithID } from "@/types/ArticleTypeWithID";
import HeroSection from "@/components/HeroSection";
import { articlesAtom } from "@/atoms/articles/atom";
import { useAtom } from "jotai";

export default function CuratedArticlesPage() {
  const [, setArticleData] = useAtom(articlesAtom);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleTypeWithID[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await getArticle();
        const updatedArticles = data.map((article: ArticleTypeWithID) => ({
          ...article,
          content: decodeURIComponent(article.content), // If needed, process content here
        }));
        setArticles(updatedArticles);
        setArticleData(updatedArticles);
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
    <div className="p-6 pt-10">
      <HeroSection
        img={"/images/pregnancy1.jpg"}
        title="More Info for You and Your Baby"
        subtitle="Medically-reviewed expert guides, tips, real-life stories, and
            articles across fertility, pregnancy, motherhood and menopause."
        direction="right"
      />
      <div className="py-10" />
      <div className="w-full mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
