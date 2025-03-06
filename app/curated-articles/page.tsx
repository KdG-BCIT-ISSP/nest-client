"use client";

import ArticleCard from "@/components/ArticleCard";
import { useEffect, useState } from "react";
import { getArticle } from "@/app/api/article/get/route";
import { ArticleType } from "@/types/ArticleType";

export default function CuratedArticlesPage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticle(); 
        for (let i = 0; i < data.length; i++) {
          
          const decodedContent = decodeURIComponent(data[i].content);
          data[i].content = decodedContent;
          }
        setArticles(data);
        
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      console.log("Articles:", articles);
      console.log("Articles title:", articles[0].title);
      console.log("Articles content:", articles[0].content);
      console.log("Articles tags:", articles[0].tagNames);
      console.log("Articles topicId:", articles[0].topicId);
      console.log("Articles type:", articles[0].type);
      console.log("Articles image:", articles[0].coverImage);
      console.log("Articles imagePreview:", articles[0].imagePreview);
      console.log("Articles link:", articles[0].link);
    }
  }, [articles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Curated Articles Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
