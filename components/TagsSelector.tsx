"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { Tag } from "@/types/Tag";
import { useTranslation } from "next-i18next";

interface TagSelectorProps {
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagsSelector({
  selectedTags,
  onTagClick,
}: TagSelectorProps) {
  const { t } = useTranslation("tag");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tag");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data: Tag[] = await response.json();
        setAvailableTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) return <div>Loading tags...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full md:w-1/2">
      <label className="text-sm font-medium text-gray-900 block mb-2">
        Tags:
      </label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Button
            key={tag.id}
            onClick={() => onTagClick(tag.name)}
            type="button"
            className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${
              selectedTags.includes(tag.name)
                ? "bg-red-300 border-red-500"
                : "bg-gray-200 border-gray-400"
            } text-black`}
          >
            {t(`tag.${tag.name.toLowerCase().replace(/[^\w]/g, "")}`, {
              defaultValue: tag.name,
            })}{" "}
            {selectedTags.includes(tag.name) && (
              <span className="ml-1">✖</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
