"use client";
export const dynamic = "force-dynamic";

import ArticleCard from "@/components/ArticleCard";
import { useEffect, useState } from "react";
import { ArticleCardType } from "@/types/ArticleCardType";
import HeroSection from "@/components/HeroSection";
import { articlesAtom } from "@/atoms/articles/atom";
import { useAtom } from "jotai";
import { get } from "../lib/fetchInterceptor";
import { useTranslation } from "react-i18next";

export default function CuratedArticlesPage() {
  const { t } = useTranslation("article");
  const [, setArticleData] = useAtom(articlesAtom);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleCardType[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await get("/api/article");
        const updatedArticles = data.map((article: ArticleCardType) => ({
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
  }, [setArticleData]);

  const handleDelete = (id: number) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

  if (loading) {
    return <div>{t("general.loading")}</div>;
  }

  return (
    <div className="p-6 pt-10">
      <HeroSection
        img={"/images/pregnancy1.jpg"}
        title={t("article.heroTitle")}
        subtitle={t("article.heroSubtitle")}
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
