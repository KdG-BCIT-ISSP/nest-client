"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import Button from "@/components/Button";
import TagsSelector from "./TagsSelector";
import ImageUpload from "./ImageUpload";
import { post } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "react-i18next";
import TopicSelector from "./TopicSelector";
import { Topic } from "@/types/Topic";

export default function CreatePost() {
  const { t } = useTranslation("post");

  const [userPost, setUserPost] = useState<PostType>({
    id: 0,
    title: "",
    content: "",
    tagNames: [],
    type: "USERPOST",
    imageBase64: [],
    topicId: 1,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();
    const [topics, setTopics] = useState<Topic[]>([]);

  // Cleans up temporary object URLs created for image previews.
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (!userPost.title?.trim()) {
      newErrors.title = t("post.titleRequired");
      isValid = false;
    }

    if (!userPost.content?.trim()) {
      newErrors.content = t("post.contentRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
      const fetchTopics = async () => {
        try {
          const response = await fetch("/api/topic");
          if (!response.ok) {
            throw new Error("Failed to fetch topics");
          }
          const data: Topic[] = await response.json();
          setTopics(data);
          if (data.length > 0) {
            setSelectedTopic(data[0]); 
            setUserPost((prev) => ({
              ...prev,
              topicId: data[0].id,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch topics:", err);
        } 
      };
  
      fetchTopics();
    }, []);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setUserPost((prevPost) => ({
      ...prevPost,
      topicId: topic.id,
    }));
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );

    setUserPost((prevPost) => ({
      ...prevPost,
      tagNames: prevPost.tagNames?.includes(tag)
        ? prevPost.tagNames.filter((t) => t !== tag)
        : [...(prevPost.tagNames || []), tag],
    }));
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    setUserPost((prevPost) => ({
      ...prevPost,
      imageBase64: prevPost.imageBase64?.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (compressedImage: string) => {
    const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setImagePreviews((prevPreviews) => [...prevPreviews, compressedImage]);

    setUserPost((prevPost) => ({
      ...prevPost,
      imageBase64: [...(prevPost.imageBase64 ?? []), compressedImage], // Ensure this is valid type
    }));
  };

  // Dynamically updates the userPost state whenever the user types something.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update the post state with the new input value
    setUserPost({ ...userPost, [name]: value });

    // Validate the input immediately
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim()
        ? ""
        : t("post.requiredField", { name: t(`post.${name}`) }),
    }));
  };

  // handle userPost submission (WIP)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;
    const updatedPost = { ...userPost, tags: selectedTags }; // Create updatedPost

    try {
      const response = await post("/api/posts", {
        title: updatedPost.title ?? "",
        content: updatedPost.content ?? "",
        topicId: updatedPost.topicId,
        type: updatedPost.type || "USERPOST",
        tagNames: updatedPost.tagNames || [],
        imageBase64: userPost.imageBase64 || [],
      });

      if (response) {
        window.alert(t("post.createSuccess"));
        window.location.href = "/posts/";
      } else {
        console.error("userPost creation failed: No response from server.");
      }
    } catch (error) {
      console.error("Failed to create userPost", error);
    } finally {
    }
  };

  return (
    <div className="bg-white border rounded-md relative m-10 p-6">
      <form onSubmit={handleSubmit}>
        <div className="gap-6">
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Topic
          </label>
          <TopicSelector 
          selectedTopic={selectedTopic || undefined}
          onTopicClick={handleTopicClick}
          topics={topics}/>
          {/* Topic Dropdown */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              {t("post.title")}
            </label>
            <input
              type="text"
              name="title"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={userPost.title}
              onChange={handleChange}
              placeholder={t("post.titlePlaceholder")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Content Input */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              {t("post.content")}
            </label>
            <textarea
              name="content"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 h-32"
              value={userPost.content}
              onChange={handleChange}
              placeholder={t("post.contentPlaceholder")}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="col-span-6 flex flex-wrap items-start gap-4">
            {/* Tag Selection */}
            <TagsSelector
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />

            {/* Image Upload */}
            <ImageUpload
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              imagePreviews={imagePreviews}
              multiple={true}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 border-t border-gray-200 flex justify-end pt-4">
          <Button
            label={t("post.publish")}
            type="submit"
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-sm px-5 py-2.5"
          />
        </div>
      </form>
    </div>
  );
}
