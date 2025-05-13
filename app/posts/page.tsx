"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { PostType } from "@/types/PostType";
import PostCard from "@/components/post/PostCard";
import HeroSection from "@/components/index/HeroSection";
import { get } from "../lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import Button from "@/components/Button";
import CreatePost from "@/components/post/CreatePost";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { translateViaApi } from "@/app/lib/translate";

const tCache: Map<string, { title: string; content: string }> = new Map();

export default function PostsPage() {
  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { t, i18n } = useTranslation("post");
  const locale = i18n.language;
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 9;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchAndTranslate() {
      try {
        setLoading(true);

        /* 1 ▸ fetch raw posts */
        const data = await get(
          `/api/posts?page=${currentPage}&size=${pageSize}`
        );

        /* 2 ▸ translate in parallel */
        const translatedPosts: PostType[] = await Promise.all(
          data.content.map(async (post: PostType) => {
            const sourceTitle = post.title;
            const sourceBody = post.content;

            if (locale === "en") return post;

            const cKey = `${post.id}-${locale}`;
            if (tCache.has(cKey)) {
              const hit = tCache.get(cKey)!;
              return { ...post, ...hit };
            }

            const [titleTr, bodyTr] = await Promise.all([
              translateViaApi(sourceTitle || "", locale),
              translateViaApi(sourceBody || "", locale),
            ]);

            tCache.set(cKey, { title: titleTr, content: bodyTr });

            return { ...post, title: titleTr, content: bodyTr };
          })
        );

        setPosts(translatedPosts);
        setTotalPages(data.page.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAndTranslate();
  }, [currentPage, locale]);

  const handleDelete = (id: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <Loader />;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="p-6">
        <HeroSection
          img={"/images/mom_and_baby.png"}
          title={t("post.communityTitle")}
          subtitle={t("post.subtitle")}
          direction="left"
        />
        {isAuthenticated && (
          <div className="max-w-7xl mx-auto p-6 flex justify-end mb-6">
            <Button
              label={t("post.create")}
              onClick={openModal}
              className="bg-secondary text-white px-6 py-3 rounded-md"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} postData={post} onDelete={handleDelete} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CreatePost />
        </Modal>
      </div>
    </>
  );
}
