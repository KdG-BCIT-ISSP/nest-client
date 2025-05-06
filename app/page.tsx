"use client";

import Container from "@/components/Container";
import Carousel from "@/components/index/Carousel";
import { useEffect, useState } from "react";
import { get } from "./lib/fetchInterceptor";
import Loader from "@/components/Loader";
import { ArticleCardType } from "@/types/ArticleCardType";
import { PostType } from "@/types/ContentType";
import { decodeAndTrim } from "@/utils/trimContent";

export default function Home() {
  const [articles, setArticles] = useState<ArticleCardType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesData, postsData] = await Promise.all([
          get("/api/content/article/mostActive"),
          get("/api/content/post/mostActive"),
        ]);
        setArticles(articlesData);
        setPosts(postsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const topArticle = articles.length ? articles[0] : null;
  const remainingArticles = articles.length > 1 ? articles.slice(1) : [];

  const topPost = posts.length ? posts[0] : null;
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="flex flex-col bg-white font-[family-name:var(--font-geist-sans)]">
      {/* ── MOBILE VIEW ── */}
      <div className="block md:hidden">
        {/* Most Popular Articles */}
        <section className="bg-white overflow-hidden shadow-sm mb-6">
          <div className="p-4 pt-6">
            {topArticle && (
              <Container
                section_title="Most Popular Articles"
                top_post_image={topArticle.coverImage}
                top_post_header={topArticle.title}
                top_post_text={decodeAndTrim(topArticle.content)}
                href={`/curated-articles`}
                href2={`/curated-articles/${topArticle.id}`}
                likes={topArticle.likesCount || 0}
                comments={topArticle.comment?.length || 0}
              />
            )}
          </div>
          {remainingArticles.length > 0 && (
            <div className="px-4 pb-6">
              <Carousel cardsData={remainingArticles} type="curated-articles" />
            </div>
          )}
        </section>

        {/* Most Popular Posts */}
        <section className="bg-white overflow-hidden shadow-sm mb-6">
          <div className="p-4 pt-6">
            {topPost && (
              <Container
                section_title="Most Popular Posts"
                top_post_image={topPost.imageBase64?.[0] || ""}
                top_post_header={topPost.title}
                top_post_text={decodeAndTrim(topPost.content)}
                href={`/posts`}
                href2={`/posts/${topPost.id}`}
                likes={topPost.likesCount || 0}
                comments={topPost.comment?.length || 0}
              />
            )}
          </div>
          {remainingPosts.length > 0 && (
            <div className="px-4 pb-6">
              <Carousel cardsData={remainingPosts} type="posts" />
            </div>
          )}
        </section>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:block">
        <main className="flex-grow p-8 sm:p-20">
          {topArticle && (
            <Container
              section_title="Most Popular Articles"
              top_post_image={topArticle.coverImage}
              top_post_header={topArticle.title}
              top_post_text={decodeAndTrim(topArticle.content)}
              href={`/curated-articles`}
              href2={`/curated-articles/${topArticle.id}`}
              likes={topArticle.likesCount || 0}
              comments={topArticle.comment?.length || 0}
            />
          )}
          {remainingArticles.length > 0 && (
            <Carousel cardsData={remainingArticles} type="curated-articles" />
          )}
        </main>
        <main className="flex-grow p-8 sm:p-20">
          {topPost && (
            <Container
              section_title="Most Popular Posts"
              top_post_image={topPost.imageBase64?.[0] || ""}
              top_post_header={topPost.title}
              top_post_text={decodeAndTrim(topPost.content)}
              href={`/posts`}
              href2={`/posts/${topPost.id}`}
              likes={topPost.likesCount || 0}
              comments={topPost.comment?.length || 0}
            />
          )}
          {remainingPosts.length > 0 && (
            <Carousel cardsData={remainingPosts} type="posts" />
          )}
        </main>
      </div>
    </div>
  );
}
