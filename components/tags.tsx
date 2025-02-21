import React from "react";
import { TagListProps } from "@/types/TagListProps";

export default function Tags({ tagsList }: TagListProps) {
    if (!tagsList || tagsList.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {tagsList.map((tag) => (
                <span
                    key={tag}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700"
                >
                    #{tag}
                </span>
            ))}
        </div>
    )
}