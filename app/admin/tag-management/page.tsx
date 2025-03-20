"use client";

import Button from "@/components/Button";
import SideMenu from "@/components/SideMenu";
import PopupWindow from "@/components/PopupWindow";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { updateTopic } from "@/app/api/topic/update/route";
import { getTopic } from "@/app/api/topic/get/route";
import { getTag } from "@/app/api/tag/get/route";
import { create } from "domain";
import { createTopic } from "@/app/api/topic/create/route";
import { createTag } from "@/app/api/tag/create/route";
import { updateTag } from "@/app/api/tag/update/route";
import { deleteTopic } from "@/app/api/topic/delete/route";
import { deleteTag } from "@/app/api/tag/delete/route";

interface Topic {
  id: number;
  name: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function TagManagementPage() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchTopics() {
    try {
      const data = await getTopic();
      const formattedTopics: Topic[] = data.map((topic: Topic) => ({
        id: topic.id,
        name: topic.name,
        description: topic.description,
      }));
      setTopics(formattedTopics);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    }
  }
  async function fetchTags() {
    try {
      setLoading(true);
      setError(null);

      const data = await getTag();
      const formattedTags: Tag[] = data.map((tag: Tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopics();
    fetchTags();
  }, []);

  const [loading, setLoading] = useState(true);

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

  const editTopic = async () => {
    if (selectedTopic) {
      try {
        const response = await updateTopic(selectedTopic.id, selectedTopic.name, selectedTopic.description || "");
        closeModal();

        if (response) {
          setTopics((prevTopics) =>
            prevTopics.map((topic) =>
              topic.id === selectedTopic.id
                ? { ...topic, name: selectedTopic.name, description: selectedTopic.description }
                : topic
            )
          );
          console.log("Topic created successfully:", response);
        } else {
          console.error("Topic creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating topic:", error);
      }
    }
  };

  const editTag = async () => {
    if (selectedTag) {
      try {
        const response = await updateTag(selectedTag.id, selectedTag.name);
        closeModal();
        if (response) {
          setTags((prevTags) =>
            prevTags.map((tag) =>
              tag.id === selectedTag.id
                ? { ...tag, name: selectedTag.name}
                : tag
            )
          );
          console.log("tag created successfully:", response);
        } else {
          console.error("tag creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating tag:", error);
      }

    }
  };

  const deleteSelectedTopic = async () => {
    if (selectedTopic) {
      try {
      const response = await deleteTopic(selectedTopic?.id);
      closeModal();

        if (response) {
          setTopics((prevTopics) =>
            prevTopics.filter((topic) =>
              topic.id !== selectedTopic.id
        )
          );
          console.log("topic created successfully:", response);
        } else {
          console.error("topic creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating topic:", error);
      }
    }
  };

  const deleteSelectedTag = async () => {
    if (selectedTag) {
      try {
      const response = await deleteTag(selectedTag?.id);
      closeModal();
        if (response) {
          setTags((prevTags) =>
            prevTags.filter((tag) =>
              tag.id !== selectedTag.id
            )
          );
          console.log("tag created successfully:", response);
        } else {
          console.error("tag creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }
  };

  const addTopic = async () => {
    if (selectedTopic) {
      try{
      const response = await createTopic(selectedTopic.name, selectedTopic.description || "");
      closeModal();

        if (response) {
          setTopics((prevTopics) => [
            ...prevTopics,
            {
              id: response.id, 
              name: selectedTopic.name,
              description: selectedTopic.description || "",
            },
          ]);
          console.log("topic created successfully:", response);
        } else {
          console.error("topic creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating topic:", error);
      }

    }
  };

  const addTag = async () => {
    if (selectedTag) {
      try{
      const response = await createTag(selectedTag.name);
      closeModal();
        if (response) {
          setTags((prevTags) => [
            ...prevTags,
            {
              id: response.id,
              name: selectedTag.name,
            },
          ]);
          console.log("tag created successfully:", response);
        } else {
          console.error("tag creation failed: No response from server.");
        }
      } catch (error) {
        console.error("Error updating tag:", error);
      }

    }
  };

  const handleInputChange = (
    field: "name" | "description",
    type: "topic" | "tag",
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    if (type === "topic") {
      setSelectedTopic((prev) => ({
        ...prev!,
        [field]: value || "",
      }));

    } else if (type === "tag") {
      setSelectedTag((prev) => ({
        ...prev!,
        [field]: value || "",
      }));

    }
  };




  return (
    <div className="p-4 sm:ml-64 bg-white">
      <SideMenu admin />
      {/* topic section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 mt-5">
          Topics Management
        </h2>
        <div className="mb-6">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center justify-between border-b border-gray-300 py-2"
            >
              <div className="flex flex-col">
                <div className="flex">
                  <span className="mr-4 text-gray-700">{index + 1}.</span>
                  <span className="text-gray-700">{topic.name}</span>
                </div>
                <p className="text-gray-400 ml-8">{topic.description}</p>
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
            data-modal-target="static-modal"
            data-modal-toggle="static-modal"
            className="text-secondary bg-container hover:bg-amber-100 font-bold rounded-md text-sm px-5 py-2.5"
          />
        </div>

        {/* tag section */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Tags Management
        </h2>
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
                {tag.name}
                <svg
                  className="ml-2 w-5 h-5 text-gray-500 dark:text-white hover:text-tertiary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
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
                  titleValue={selectedTopic?.name || ""}
                  onTitleChange={(e) => handleInputChange("name", "topic", e)}
                  submitButtonText="Save"
                  onDescriptionChange={(e) => handleInputChange("description", "topic", e)}
                  descriptionValue={selectedTopic?.description || ""}
                  deleteButton={true}
                  descriptionInput={true}
                  onSubmit={() => editTopic()}
                  onClose={closeModal}
                  onDelete={() => deleteSelectedTopic()}
                />
              </div>
            </div>
          )}

          {/* add topics popup window modal */}
          {modalIndex === 2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="absolute inset-0 flex justify-center items-center">
                <PopupWindow
                  title="Create a New Topic"
                  titleValue={selectedTopic?.name || ""}
                  onTitleChange={(e) => handleInputChange("name", "topic", e)}
                  submitButtonText="Add"
                  onDescriptionChange={(e) => handleInputChange("description", "topic", e)}
                  descriptionValue={selectedTopic?.description || ""}
                  descriptionInput={true}
                  deleteButton={false}
                  onSubmit={() =>
                    addTopic()
                  }
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
                  titleValue={selectedTag?.name || ""}
                  onTitleChange={(e) => handleInputChange("name", "tag", e)}
                  submitButtonText="Save"
                  descriptionValue=""
                  descriptionInput={false}
                  deleteButton={true}
                  onSubmit={() => editTag()}
                  onClose={closeModal}
                  onDelete={() => deleteSelectedTag()}
                />
              </div>
            </div>
          )}

          {/* add tag popup window modal */}
          {modalIndex === 4 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="absolute inset-0 flex justify-center items-center">
                <PopupWindow
                  title="Create a New Tag"
                  titleValue={selectedTag?.name || ""}
                  onTitleChange={(e) => handleInputChange("name", "tag", e)}
                  submitButtonText="Add"
                  descriptionValue=""
                  descriptionInput={false}
                  deleteButton={false}
                  onSubmit={() => addTag()}
                  onClose={closeModal}
                  onDelete={() => { }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
