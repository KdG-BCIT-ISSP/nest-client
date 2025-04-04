"use client";
export const dynamic = "force-dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Add useRouter
import { PostGridType } from "@/types/PostType";
import { ArticleType } from "@/types/ArticleType";
import SearchBar from "@/components/search/SearchBar";
import PostGrid from "@/components/search/PostGrid";
import ArticleGrid from "@/components/search/ArticleGrid";
import { get } from "@/app/lib/fetchInterceptor";
import Loader from "@/components/Loader";

type OptionType = {
  id: string;
  name: string;
};

type FilterParams = {
  search_query?: string;
  topic?: string[];
  topics?: string[];
  tag?: string[];
  tags?: string[];
  order_by?: string;
  order?: string;
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query");
  const [activeTab, setActiveTab] = useState<"posts" | "articles">("posts");
  const [results, setResults] = useState<PostGridType[] | ArticleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTopics, setAvailableTopics] = useState<OptionType[]>([]);
  const [availableTags, setAvailableTags] = useState<OptionType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterParams>({
    search_query: query || "",
    topics: [],
    tags: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [topicsData, tagsData] = await Promise.all([
          get("/api/topic"),
          get("/api/tag"),
        ]);
        setAvailableTopics(topicsData || []);
        setAvailableTags(tagsData || []);
      } catch (error) {
        console.error("Error fetching topics/tags", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    setAppliedFilters((prev) => ({
      ...prev,
      search_query: query || "",
    }));
  }, [query]);

  const handleFilterApply = () => {
    const newFilters = {
      search_query: query || "",
      topics: selectedTopics,
      tags: selectedTags,
    };
    setAppliedFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.search_query) {
      params.append("query", newFilters.search_query);
    }
    if (newFilters.topics?.length) {
      newFilters.topics.forEach((t) => params.append("topic", t));
    }
    if (newFilters.tags?.length) {
      newFilters.tags.forEach((t) => params.append("tag", t));
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        !appliedFilters.search_query &&
        !appliedFilters.topics?.length &&
        !appliedFilters.tags?.length
      )
        return;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (appliedFilters.search_query) {
          params.append("search_query", appliedFilters.search_query);
        }
        if (appliedFilters.topics?.length) {
          appliedFilters.topics.forEach((t) => params.append("topic", t));
        }
        if (appliedFilters.tags?.length) {
          appliedFilters.tags.forEach((t) => params.append("tag", t));
        }

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const endpoint = activeTab === "posts" ? "post" : "article";
        const data = await get(`/api/search/${endpoint}${queryString}`);
        setResults(data?.content || []);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching search results.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, appliedFilters]);

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
                value={topic.name}
                checked={selectedTopics.includes(topic.name)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTopics((prev) =>
                    prev.includes(value)
                      ? prev.filter((name) => name !== value)
                      : [...prev, value]
                  );
                }}
                className="mr-2 h-4 w-4 text-secondary border-gray-300 rounded"
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
                    prev.includes(tag.name)
                      ? prev.filter((name) => name !== tag.name)
                      : [...prev, tag.name]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.name)
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
        {loading && <Loader />}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-gray-600">No results found.</p>
        )}
        {activeTab === "posts" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {results.map((item) => (
              <div key={item.id} className="mb-6 break-inside-avoid">
                <PostGrid post={item as PostGridType} />
              </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchPageContent />
    </Suspense>
  );
}
