"use client";
export const dynamic = "force-dynamic";

import ArticleCard from "@/components/search/ArticleCard";
import { useEffect, useState } from "react";
import { ArticleCardType } from "@/types/ArticleCardType";
import HeroSection from "@/components/index/HeroSection";
import { articlesAtom } from "@/atoms/articles/atom";
import { useAtom } from "jotai";
import { get } from "../lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import Button from "@/components/Button";
import CreateArticle from "@/components/article/CreateArticle";
import { userAtom } from "@/atoms/user/atom";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

export default function CuratedArticlesPage() {
  const [userData] = useAtom(userAtom);
  const { t } = useTranslation("article");
  const [, setArticleData] = useAtom(articlesAtom);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleCardType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await get("/api/article");
        const updatedArticles = data.map((article: ArticleCardType) => ({
          ...article,
          content: decodeURIComponent(article.content),
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center p-6 pt-10">
      <div className="relative w-full h-96 mb-10">
        <HeroSection
          img={"/images/pregnancy1.jpg"}
          title={t("article.heroTitle")}
          subtitle={t("article.heroSubtitle")}
          direction="right"
        />
        {(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") && (
          <div className="max-w-7xl mx-auto p-6 flex justify-end mb-6">
            <Button
              label={t("article.create")}
              onClick={openModal}
              className="bg-secondary text-white px-6 py-3 rounded-md"
            />
          </div>
        )}
      </div>
      <div className="py-10" />

      <div className="w-full mx-auto px-6">
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateArticle />
      </Modal>
    </div>
  );
}
