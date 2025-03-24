"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostGridType } from "@/types/PostType";
import { ArticleType } from "@/types/ArticleType";
import SearchBar from "@/components/SearchBar";
import PostGrid from "@/components/PostGrid";
import ArticleGrid from "@/components/ArticleGrid";
import { get } from "@/app/lib/fetchInterceptor";

type OptionType = {
  id: string;
  name: string;
};

type FilterParams = {
  search_query?: string;
  topic?: string[];
  tag?: string[];
  order_by?: string;
  order?: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [activeTab, setActiveTab] = useState<"posts" | "articles">("posts");
  const [results, setResults] = useState<PostGridType[] | ArticleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTopics, setAvailableTopics] = useState<OptionType[]>([]);
  const [availableTags, setAvailableTags] = useState<OptionType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [appliedFilters, setAppliedFilters] = useState({
    topics: [] as string[],
    tags: [] as string[],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [topicsData, tagsData] = await Promise.all([
          get("/api/topic"), // Adjust endpoint as needed
          get("/api/tag"), // Adjust endpoint as needed
        ]);
        setAvailableTopics(topicsData || []);
        setAvailableTags(tagsData || []);
      } catch (error) {
        console.error("Error fetching topics/tags", error);
      }
    };
    fetchOptions();
  }, []);

  const handleFilterApply = () => {
    setAppliedFilters({
      topics: selectedTopics,
      tags: selectedTags,
    });
  };

  useEffect(() => {
    if (query) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const filterParams: FilterParams = {
            search_query: query,
            ...(appliedFilters.topics.length > 0 && {
              topic: appliedFilters.topics,
            }),
            ...(appliedFilters.tags.length > 0 && { tag: appliedFilters.tags }),
          };

          const params = new URLSearchParams();
          if (filterParams.search_query)
            params.append("search_query", filterParams.search_query);
          if (filterParams.topic)
            filterParams.topic.forEach((t) => params.append("topic", t));
          if (filterParams.tag)
            filterParams.tag.forEach((t) => params.append("tag", t));

          const queryString = params.toString() ? `?${params.toString()}` : "";
          const endpoint = activeTab === "posts" ? "post" : "article";
          const data = await get(`/api/search/${endpoint}${queryString}`);

          setResults(data || []);
        } catch (err) {
          console.error(err);
          setError("An error occurred while fetching search results.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [query, activeTab, appliedFilters]);

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 p-5 shadow-md bg-container">
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            TOPICS
          </label>
          {availableTopics.map((topic) => (
            <div key={topic.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={topic.id}
                checked={selectedTopics.includes(topic.id)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTopics((prev) =>
                    prev.includes(value)
                      ? prev.filter((id) => id !== value)
                      : [...prev, value]
                  );
                }}
                className="mr-2"
              />
              <span className="text-gray-700">{topic.name}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            TAGS
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((id) => id !== tag.id)
                      : [...prev, tag.id]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.id)
                    ? "bg-tertiary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFilterApply}
          className="w-full bg-secondary text-white py-2 rounded-md hover:bg-green-700"
        >
          Apply Filters
        </button>
      </div>

      <div className="w-3/4 p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Search Results for &quot;{query}&quot;
        </h1>

        <div className="mb-4">
          <button
            onClick={() => {
              setResults([]);
              setActiveTab("posts");
            }}
            className={`px-4 py-2 mr-2 rounded-md ${
              activeTab === "posts"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => {
              setResults([]);
              setActiveTab("articles");
            }}
            className={`px-4 py-2 rounded-md ${
              activeTab === "articles"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Articles
          </button>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-gray-600">No results found.</p>
        )}

        {activeTab === "posts" ? (
          <div className="grid grid-cols-2 gap-6 items-start">
            {results.map((item) => (
              <PostGrid key={item.id} post={item as PostGridType} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {results.map((item) => (
              <ArticleGrid key={item.id} article={item as PostGridType} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
