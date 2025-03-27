"use client";
import React, { useState } from "react";
import { Topic } from "@/types/Topic";
import { useTranslation } from "next-i18next";

interface TopicSelectorProps {
  selectedTopic?: Topic;
  onTopicClick: (topic: Topic) => void;
  topics: Topic[];
}

export default function TopicSelector({
  selectedTopic,
  onTopicClick,
  topics,
}: TopicSelectorProps) {
  const { t } = useTranslation("topic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTopicClick = (topic: Topic) => {
    onTopicClick(topic);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full md:w-4/5 relative">
      <button
        onClick={toggleDropdown}
        className="text-black bg-white font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center w-3/4 justify-between border border-gray-300"
        type="button"
      >
        {selectedTopic &&
          t(`topic.${selectedTopic.name.toLowerCase().replace(/[^\w]/g, "")}`, {
            defaultValue: selectedTopic.name,
          })}
        <svg
          className="w-2.5 h-2.5 ms-3 stroke-blue-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          id="dropdownInformation"
          className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto"
            aria-labelledby="dropdownInformationButton"
          >
            {topics.map((topic) => (
              <li key={topic.id}>
                <button
                  onClick={() => handleTopicClick(topic)}
                  className={`block w-full text-left px-4 py-2 bg-secondary hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    selectedTopic?.id === topic.id ? "bg-gray-100" : ""
                  }`}
                >
                  {t(
                    `topic.${topic.name.toLowerCase().replace(/[^\w]/g, "")}`,
                    { defaultValue: topic.name }
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
