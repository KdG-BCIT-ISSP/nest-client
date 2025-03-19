"use client";

import Button from "@/components/Button";
import SideMenu from "@/components/SideMenu";
import PopupWindow from "@/components/PopupWindow";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { updateTopic } from "@/app/api/topic/update/route";
import { getTopic } from "@/app/api/topic/get/route";
import { getTag } from "@/app/api/tag/get/route";

interface Topic {
  id: number;
  topicTitle: string;
}

interface Tag {
  id: number;
  tagName: string;
}

export default function TagManagementPage() {


  useEffect(() => {
      async function fetchTopics() {
        try {
          const data = await getTopic();
          setTopics(data);
        } catch (err) {
          console.error("Failed to fetch topics:", err);
        } 
      }
    async function fetchTags() {
      try {
        const data = await getTag();
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }
  
    fetchTopics();
    fetchTags();
    }, []);

  const [loading, setLoading] = useState(true);


  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newTopic, setNewTopic] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  const showModal = (index: number, id?: number) => {
    setModalIndex(index);
    switch (index) {
      case 1:
        if (id) {
          const topic = topics.find((topic) => topic.id === id);
          setSelectedTopic(topic || null);
        }
        break;
      case 3:
        if (id) {
          const tag = tags.find((tag) => tag.id === id);
          setSelectedTag(tag || null);
        }
        break;
      default:
        setSelectedTopic(null);
        setSelectedTag(null);
        break;
    }
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const editTopic = async(newTopic: string) => {
    if (selectedTopic) {
      try{
        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic.id === selectedTopic.id
              ? { ...topic, topicTitle: newTopic }
              : topic
          )
        );

        const response = await updateTopic(selectedTopic.id, newTopic, "");
        closeModal();

        if (response) {
          console.log("Topic created successfully:", response);
        } else {
          console.error("Topic creation failed: No response from server.");
        }
      }catch(error){
        console.error("Error updating topic:", error);
      }
      
    
  }

}

const editTag = (newTag: string) => {
  setTags((prevTags) =>
    prevTags.map((tag) =>
      tag.id === selectedTag?.id
        ? { ...tag, tagName: newTag }
        : tag
    )
  );
  closeModal();
}



const deleteTopic = () => {
  setTopics((prevTopics) =>
    prevTopics.filter((topic) =>
      topic.id !== selectedTopic?.id));
  closeModal();
}

const deleteTag = () => {
  setTags((prevTags) =>
    prevTags.filter((tag) =>
      tag.id !== selectedTag?.id));
  closeModal();
}

const addTopic = (newTopic: string) => {
  setTopics((prevTopics) => [
    ...prevTopics,
    { id: prevTopics.length + 1, topicTitle: newTopic }
  ]);
  closeModal();
}

const addTag = (newTag: string) => {
  setTags((prevTags) => [
    ...prevTags,
    { id: prevTags.length + 1, tagName: newTag }
  ]);
  closeModal();
}



return (
  <div className="p-4 sm:ml-64 bg-white">
    <SideMenu admin />
    {/* topic section */}
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
            <Button
              className="text-secondary underline"
              onClick={() => showModal(1, topic.id)}
              label="Edit"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 border-gray-200 flex justify-end pt-4">

        <Button
          label="Add Topic"
          onClick={() => showModal(2)}
          data-modal-target="static-modal" data-modal-toggle="static-modal"
          className="text-secondary bg-container hover:bg-amber-100 font-bold rounded-md text-sm px-5 py-2.5"
        />

      </div>

      {/* tag section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Tags Management</h2>
      <div className="flex flex-wrap">
        {tags.map((tag: Tag) => (
          <div
            key={tag.id}
            className="flex border border-gray-400 items-center bg-white text-white px-2 py-2 rounded-md mb-2 mx-2"
          >
            <button
              className="text-gray-500 flex"
              onClick={() => showModal(3, tag.id)}
            >
              {tag.tagName}
              <svg className="ml-2 w-5 h-5 text-gray-500 dark:text-white hover:text-tertiary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
              </svg>

            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-gray-200 flex justify-end pt-4 border-t border-gray-300">

        <Button
          label="Add Tag"
          onClick={() => showModal(4)}
          className="text-tertiary bg-primary hover:bg-red-200 font-bold rounded-md text-sm px-5 py-2.5"
        />
        {/* edit topics popup window modal */}
        {modalIndex === 1 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="absolute inset-0 flex justify-center items-center">
              <PopupWindow
                title="Edit Topic"
                inputValue={newTopic}
                onInputChange={setNewTopic}
                content={selectedTopic?.topicTitle || ""}
                submitButtonText="Save"
                deleteButton={true}
                onSubmit={() => editTopic(newTopic)}
                onClose={closeModal}
                onDelete={() => deleteTopic()}
              />
            </div>
          </div>
        )}

        {/* add topics popup window modal */}
        {modalIndex === 2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="absolute inset-0 flex justify-center items-center">
              <PopupWindow
                title="Add Topic"
                inputValue={newTopic}
                onInputChange={setNewTopic}
                content={selectedTopic?.topicTitle || ""}
                submitButtonText="Add"
                deleteButton={false}
                onSubmit={() => addTopic(newTopic)}
                onClose={closeModal}
                onDelete={() => { }}
              />
            </div>
          </div>
        )}

        {/* edit tag popup window modal */}
        {modalIndex === 3 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="absolute inset-0 flex justify-center items-center">
              <PopupWindow
                title="Edit Tag"
                inputValue={newTag}
                onInputChange={setNewTag}
                content={selectedTag?.tagName || ""}
                submitButtonText="Save"
                deleteButton={true}
                onSubmit={() => editTag(newTag)}
                onClose={closeModal}
                onDelete={() => deleteTag()}
              />
            </div>
          </div>
        )}

        {/* add tag popup window modal */}
        {modalIndex === 4 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="absolute inset-0 flex justify-center items-center">
              <PopupWindow
                title="Add Tag"
                inputValue={newTag}
                onInputChange={setNewTag}
                content={selectedTag?.tagName || ""}
                submitButtonText="Save"
                deleteButton={false}
                onSubmit={() => editTag(newTag)}
                onClose={closeModal}
                onDelete={() => deleteTag()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
