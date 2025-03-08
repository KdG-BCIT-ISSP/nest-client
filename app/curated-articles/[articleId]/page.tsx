"use client";

import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { useState } from "react";
import Image from "next/image";
import { articlesAtom } from "@/atoms/articles/atom";
import Back from "@/public/svg/Article/Back";
import Dots from "@/public/svg/Article/Dots";
import parse from "html-react-parser";
import Report from "@/public/svg/Article/Report";
import ArticleThumpsUp from "@/public/svg/Article/ThumbsUp";
import ArticleComment from "@/public/svg/Article/Comment";
import ArticleBookmark from "@/public/svg/Article/Bookmark";
import ArticleShare from "@/public/svg/Article/Share";
import Tags from "@/components/Tags";
import CommentsSection from "@/components/Comments";

export default function ArticleDetailsPage() {
  const params = useParams();
  const articleId = Number(params.articleId);
  const [articles] = useAtom(articlesAtom);
  const [showReport, setShowReport] = useState(false);

  // TODO: replace article find with api call
  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return <div>Article not found</div>;
  }

  const html = parse(article.content);

  console.log(article.tagNames);

  return (
    <div className="w-max mx-auto pt-10">
      <div className="flex justify-between items-center p-4">
        <button onClick={() => window.history.back()}>
          <Back />
        </button>
        <div className="relative">
          <button onClick={() => setShowReport((prev) => !prev)}>
            <Dots />
          </button>
          {showReport && (
            <div className="absolute right-0 mt-1 z-10">
              <Report />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pt-4 text-black">
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            By <b>{article.memberUsername}</b> | {new Date().toLocaleString()}
          </p>

          <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
            {article.title}
          </h1>

          <Tags tagsList={article.tagNames} />

          <div className="relative w-full h-[400px] rounded-t-lg md:rounded-none overflow-hidden">
            <Image
              src={article.coverImage}
              alt={"Article cover image"}
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
          </div>
        </div>
        <hr className="border-gray-600 p-4" />

        {/* Article Content */}
        <div className="prose prose-green mb-8">{html}</div>
        <div className="flex justify-end gap-4">
          <ArticleThumpsUp count={224} />
          <ArticleComment count={32} />
          <ArticleBookmark count={212} />
          <ArticleShare count={12} />
        </div>
        <CommentsSection />
      </div>
    </div>
  );
}
