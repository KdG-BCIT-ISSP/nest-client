"use client";

import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import Image from "next/image";
import { articlesAtom } from "@/atoms/articles/atom";
import Back from "@/public/svg/Article/Back";
import Dots from "@/public/svg/Article/Dots";
import parse from "html-react-parser";

export default function ArticleDetailsPage() {
  const params = useParams();
  const articleId = Number(params.articleId);
  const [articles] = useAtom(articlesAtom);

  // TODO: replace article find with api call
  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return <div>Article not found</div>;
  }

  console.log(article);

  const html = parse(article.content);

  return (
    <div className="max-w-2xl mx-auto p-4 pt-20 text-black">
      <Back />
      <Dots />
      <div className="mb-6">
        <p className="text-sm text-gray-700">
          By <b>{article.memberUsername}</b> | {new Date().toLocaleString()}
        </p>

        <h1 className="text-3xl text-black font-bold mt-2 mb-2 font-serif">
          {article.title}
        </h1>

        {article.tagNames}

        <div className="relative w-full h-[400px] rounded-t-lg md:rounded-none overflow-hidden">
          <Image
            src={article.coverImage}
            alt={"Article cover image"}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority
          />
        </div>
        <hr className="border-gray-600" />
      </div>

      {/* Article Content */}
      <div className="prose prose-green mb-8">{html}</div>
    </div>
  );
}
