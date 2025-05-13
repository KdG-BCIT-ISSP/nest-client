"use client";
export const dynamic = "force-dynamic";

import ArticleCard from "@/components/search/ArticleCard";
import { useEffect, useState } from "react";
import { ArticleCardType } from "@/types/ArticleCardType";
import HeroSection from "@/components/index/HeroSection";
import { useAtom } from "jotai";
import { get } from "../lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import Button from "@/components/Button";
import CreateArticle from "@/components/article/CreateArticle";
import { userAtom } from "@/atoms/user/atom";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { translateViaApi } from "@/app/lib/translate";

const tCache: Map<string, { title: string }> = new Map();

export default function CuratedArticlesPage() {
  const [userData] = useAtom(userAtom);
  const { t, i18n } = useTranslation("article");
  const locale = i18n.language;

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleCardType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchAndTranslate() {
      try {
        setLoading(true);

        /* 1 ▸ fetch raw articles */
        const data = await get(
          `/api/article?page=${currentPage}&size=${pageSize}`
        );

        /* 2 ▸ translate titles & bodies in parallel */
        const translatedArticles: ArticleCardType[] = await Promise.all(
          data.content.map(async (article: ArticleCardType) => {
            if (locale === "en") return article;

            const cKey = `${article.id}-${locale}`;
            if (tCache.has(cKey)) {
              return { ...article, ...tCache.get(cKey)! };
            }

            const [titleTr] = await Promise.all([
              translateViaApi(article.title || "", locale),
            ]);

            tCache.set(cKey, {
              title: titleTr,
            });
            return { ...article, title: titleTr };
          })
        );

        setArticles(translatedArticles);
        setTotalPages(data.page.totalPages);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndTranslate();
  }, [currentPage, locale]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* ───────────── MOBILE VIEW ───────────── */}
      <div className="block md:hidden p-4 pt-6">
        <div className="mb-6">
          <HeroSection
            img="/images/pregnancy1.jpg"
            title={t("article.heroTitle")}
            subtitle={t("article.heroSubtitle")}
            direction="right"
          />

          {(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") && (
            <div className="mb-6 pt-6">
              <Button
                label={t("article.create")}
                onClick={openModal}
                className="w-full bg-secondary text-white py-3 rounded-md"
              />
            </div>
          )}
        </div>
        <div className="w-full px-2 mt-8 space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-6 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CreateArticle />
        </Modal>
      </div>

      {/* ───────────── WEB VIEW ───────────── */}
      <div className="hidden md:flex flex-col items-center p-6 pt-10">
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
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CreateArticle />
        </Modal>
      </div>
    </>
  );
}
