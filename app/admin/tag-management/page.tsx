"use client";

import Button from "@/components/Button";
import SideMenu from "@/components/SideMenu";
import PopupWindow from "@/components/PopupWindow";
import { useEffect, useState } from "react";

interface Topic {
  id: number;
  topicTitle: string;
}

interface Tag {
  id: number;
  tagName: string;
}

export default function TagManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [submitButtonText, setSubmitButtonText] = useState<string>("");
  const [deleteButton, setDeleteButton] = useState<boolean>(false);
  const [modalId, setModalId] = useState<string>("");
  const [SubmitHandler, setSubmitHandler] = useState<() => void>(() => { });

  const handleAddTopic = () => {
    setModalTitle("Add Topic");
    setSubmitButtonText("Add Topic");
    setShowModal(true);  
  };

  const addPopupEvent = (id:string, title: string, submitButtonText: string, deleteButton: boolean, submitHandler:()=>void) => {
    setModalId(id);
    setModalTitle(title);
    setSubmitButtonText(submitButtonText);
    setDeleteButton(deleteButton);
    setSubmitHandler(submitHandler);
    setShowModal(true);  
  }

  const handleEditTopicButton = (topic:Topic) => {
    console.log("Edit Topic Button Clicked");
    addPopupEvent(
      "add-topic-modal",
      "Add Topic",
      "Add Topic",
      false,
      () => { handleEditTopic(topic); }
    );
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (showModal) {
      console.log('Modal is shown!');  
    }
  }, [showModal]);

  const initialTopics = [
    { id: 1, topicTitle: "Maternal Health & Wellness" },
    { id: 2, topicTitle: "Child Health & Wellness" },
    { id: 3, topicTitle: "Parenting & Child Development" },
    { id: 4, topicTitle: "Mental Work-Life Balance & Career Support" },
    { id: 5, topicTitle: "Child Safety & Emergency Preparedness" },
  ]

  const initialTags = [
    { id: 1, tagName: "Pregnancy" },
    { id: 2, tagName: "Newborn Care" },
    { id: 3, tagName: "Tips" },
    { id: 4, tagName: "Parenting" },
    { id: 5, tagName: "Work-Life Balance" },
    { id: 6, tagName: "Baby" },
  ]

  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic({ ...topic });
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag({ ...tag });
  };

  const handleSaveTopic = () => {
    if (editingTopic) {
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === editingTopic.id ? editingTopic : topic
        )
      );
    }
    setEditingTopic(null);  
  };


  const handleSaveTag = () => {
    if (editingTag) {
      setTags((prevTags) =>
        prevTags.map((tag) => (tag.id === editingTag.id ? editingTag : tag))
      );
    }
    setEditingTag(null);  
  };

  const handleDeleteTopic = (id: number) => {
    setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== id));
  };

  const handleDeleteTag = (id: number) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

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
              <Button 
              className="text-secondary underline" 
              onClick={() => handleEditTopicButton(topic)}
              >Edit</Button>
            </div>
          ))}
        </div>
        <div className="mt-6 border-gray-200 flex justify-end pt-4">

          <Button
            label="Add Topic"
            data-modal-target="static-modal" data-modal-toggle="static-modal"
            className="text-secondary bg-container hover:bg-amber-100 font-bold rounded-md text-sm px-5 py-2.5"
          />

        </div>


        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tags Management</h2>
        <div className="flex flex-wrap">
          {initialTags.map((tag: Tag) => (
            <div
              key={tag.id}
              className="flex border border-gray-400 items-center bg-white text-white px-2 py-2 rounded-md mb-2 mx-2"
            >
              <button className="text-gray-500 flex">
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
            onClick={() => { }}
            className="text-tertiary bg-primary hover:bg-red-200 font-bold rounded-md text-sm px-5 py-2.5"
          />
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="absolute inset-0 flex justify-center items-center">
            <PopupWindow
              windowId= {modalId}
              title={modalTitle}
              submitButtonText={submitButtonText}
              deleteButton={deleteButton}
              onClick={SubmitHandler} 
              className="text-tertiary bg-primary hover:bg-red-200 font-bold rounded-md text-sm px-5 py-2.5"
            />
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
