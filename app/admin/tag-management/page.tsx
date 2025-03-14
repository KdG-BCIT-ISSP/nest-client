"use client";

import Button from "@/components/Button";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";

export default function TagManagementPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);
  const topics = [
    { id: 1, topicTitle: "Maternal Health & Wellness" },
    { id: 2, topicTitle: "Child Health & Wellness" },
    { id: 3, topicTitle: "Parenting & Child Development" },
    { id: 4, topicTitle: "Mental Work-Life Balance & Career Support" },
    { id: 5, topicTitle: "Child Safety & Emergency Preparedness" },
  ]

  const tagsList = [
    { id: 1, tagName: "Pregnancy" },
    { id: 2, tagName: "Newborn Care" },
    { id: 3, tagName: "Tips" },
    { id: 4, tagName: "Parenting" },
    { id: 5, tagName: "Work-Life Balance" },
    { id: 6, tagName: "Baby" },
  ]

  return (
    <div className="p-4 sm:ml-64 bg-white">
      <SideMenu admin />
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 mt-5">Topics Management</h2>
        <div className="mb-6">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center justify-between border-b border-gray-300 py-2"
            >
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">{index + 1}.</span>
                <span className="text-gray-700">{topic.topicTitle}</span>
              </div>
              <Button className="text-secondary underline">Edit</Button>
            </div>
          ))}
        </div>
        <div className="mt-6 border-gray-200 flex justify-end pt-4">

          <Button
            label="Add Topic"
            onClick={() => { }}
            className="text-secondary bg-container hover:bg-amber-100 font-bold rounded-md text-sm px-5 py-2.5"
          />

        </div>


        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tags Management</h2>
        <div className="flex flex-wrap">
          {tagsList.map((tag) => (
            <div
              key={tag.id}
              className="flex border border-gray-400 items-center bg-white text-white px-2 py-2 rounded-md mb-2 mx-2"
            >
              <button className="text-gray-500 flex">
                {tag.tagName}
                <svg className="ml-2 w-5 h-5 text-gray-500 dark:text-white hover:text-tertiary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>

              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-gray-200 flex justify-end pt-4 border-t border-gray-300">

          <Button
            label="Add Tag"
            onClick={() => { }}
            className="text-tertiary bg-primary hover:bg-red-200 font-bold rounded-md text-sm px-5 py-2.5"
          />

        </div>
      </div>
    </div>
  );
}
