"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  topics?: string[];
  tags?: string[];
  order_by?: string;
  order?: string;
  page?: number;
  size?: number;
};

interface PaginatedResponse {
  content: PostGridType[] | ArticleType[];
  page?: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-1 rounded ${
              page === currentPage
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() =>
            onPageChange(Math.min(currentPage + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query");

  const [activeTab, setActiveTab] = useState<"posts" | "articles">("posts");
  const [results, setResults] = useState<PostGridType[] | ArticleType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
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
    order_by: "createdAt",
    order: "desc",
    page: 0,
    size: 4,
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
    const newFilters: FilterParams = {
      search_query: query || "",
      topics: selectedTopics,
      tags: selectedTags,
      order_by: appliedFilters.order_by,
      order: appliedFilters.order,
      page: 0,
      size: appliedFilters.size,
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
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        !appliedFilters.search_query &&
        !appliedFilters.topics?.length &&
        !appliedFilters.tags?.length
      ) {
        setResults([]);
        setTotalPages(1);
        return;
      }
      setLoading(true);
      setError("");
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
        if (appliedFilters.order_by) {
          params.append("order_by", appliedFilters.order_by);
        }
        if (appliedFilters.order) {
          params.append("order", appliedFilters.order);
        }
        if (typeof appliedFilters.page === "number") {
          params.append("page", appliedFilters.page.toString());
        }
        if (typeof appliedFilters.size === "number") {
          params.append("size", appliedFilters.size.toString());
        }
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const endpoint = activeTab === "posts" ? "post" : "article";
        const data: PaginatedResponse = await get(
          `/api/search/${endpoint}${queryString}`
        );
        setResults(data?.content || []);
        const total = data?.page?.totalPages || 1;
        setTotalPages(total);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching search results.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, appliedFilters]);

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppliedFilters((prev) => ({
      ...prev,
      order_by: e.target.value,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/4 p-5 shadow-md bg-white">
        <div className="mb-6">
          <SearchBar />
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Topics</h2>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
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
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
      </aside>

      <main className="w-3/4 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Search Results for &quot;{query}&quot;
        </h1>

        <div className="mb-6">
          <button
            onClick={() => {
              setResults([]);
              setActiveTab("posts");
            }}
            className={`text-md px-4 py-2 mr-4 rounded-md font-semibold ${
              activeTab === "posts"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => {
              setResults([]);
              setActiveTab("articles");
            }}
            className={`text-md px-4 py-2 rounded-md font-semibold ${
              activeTab === "articles"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Articles
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Order By:</label>
          <select
            className="border border-gray-300 rounded-full py-1 px-4 text-sm"
            value={appliedFilters.order_by}
            onChange={handleOrderChange}
          >
            <option value="createdAt">Date</option>
            <option value="likesCount">Likes</option>
            <option value="viewCount">Views</option>
          </select>
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

        {totalPages > 0 && (
          <Pagination
            currentPage={appliedFilters.page || 0}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
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
