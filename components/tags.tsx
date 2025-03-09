import React from "react";
import { TagListProps } from "@/types/TagListProps";

export default function Tags({ tagsList }: TagListProps) {
  if (!tagsList || tagsList.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {tagsList.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 bg-accent text-gray-800 rounded-md mr-2 mb-2"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
