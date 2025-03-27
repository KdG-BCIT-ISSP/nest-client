"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { Topic } from "@/types/Topic";

interface TopicSelectorProps {
  selectedTopic?: Topic;
  onTopicClick: (topic: Topic) => void; 
  topics: Topic[];
}

export default function TopicSelector({
  selectedTopic,
  onTopicClick,
  topics
}: TopicSelectorProps) {

  const [error, setError] = useState<string | null>(null);
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
        className="text-black bg-white font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:text-white w-3/4 flex justify-between border border-gray-300 dark:border-gray-600"
        type="button"
      >
        {selectedTopic?.name}
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
          className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto"
            aria-labelledby="dropdownInformationButton"
          >
            {topics.map((topic) => (
              <li key={topic.id}>
                <button
                  onClick={() => handleTopicClick(topic)} 
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${selectedTopic?.id === topic.id
                      ? "bg-gray-100 dark:bg-gray-600"
                      : ""
                    }`}
                >
                  {topic.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}