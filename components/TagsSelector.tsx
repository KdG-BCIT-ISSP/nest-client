import React from "react";
import Button from "@/components/Button";

const AVAILABLE_TAGS = [
    "Tips",
    "Baby",
    "Travel",
    "Food",
    "Health",
    "Education",
    "Fitness",
    "Technology",
];


interface TagSelectorProps {
    selectedTags: string[];
    onTagClick: (tag: string) => void;
}

export default function TagsSelector({ selectedTags, onTagClick }: TagSelectorProps) {



    return (
        <div className="w-full md:w-1/2">
            <label className="text-sm font-medium text-gray-900 block mb-2">
                Tags:
            </label>
            <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                    <Button
                        key={tag}
                        onClick={() => onTagClick(tag)}
                        type="button"
                        className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${selectedTags.includes(tag)
                            ? "bg-red-300 border-red-500"
                            : "bg-gray-200 border-gray-400"
                            } text-black`}
                    >
                        {tag}{" "}
                        {selectedTags.includes(tag) && (
                            <span className="ml-1">✖</span>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
