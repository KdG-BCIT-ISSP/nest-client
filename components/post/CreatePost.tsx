"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import Button from "@/components/Button";
import TagsSelector from "../TagsSelector";
import ImageUpload from "../ImageUpload";
import { post, get, put } from "@/app/lib/fetchInterceptor";
import { useTranslation } from "next-i18next";
import TopicSelector from "../TopicSelector";
import { Topic } from "@/types/Topic";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";

interface CreatePostProps {
  existingPost?: PostType;
}

export default function CreatePost({ existingPost }: CreatePostProps) {
  const { t } = useTranslation("post");
  const [userData] = useAtom(userAtom);

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

  useEffect(() => {
    if (existingPost) {
      setUserPost(existingPost);
      setSelectedTags(existingPost.tagNames || []);
      setImagePreviews(existingPost.imageBase64 || []);
      const selectedTopic = topics.find(
        (topic) => topic.id === existingPost.topicId
      );
      if (selectedTopic) {
        setSelectedTopic(selectedTopic);
      }
      console.log(selectedTopic);
    }
  }, [existingPost, topics]);

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
        const data = await get("/api/topic");
        setTopics(data);
        setSelectedTopic(data[0]);
        if (data.length > 0) {
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
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setUserPost((prevPost) => ({
      ...prevPost,
      imageBase64: prevPost.imageBase64?.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (compressedImage: string) => {
    setImagePreviews((prev) => [...prev, compressedImage]);
    setUserPost((prevPost) => ({
      ...prevPost,
      imageBase64: [...(prevPost.imageBase64 ?? []), compressedImage],
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;
    try {
      if (existingPost) {
        // Update existing post
        const response = await put(`/api/posts`, {
          ...userPost,
          id: existingPost.id,
          memberId: userData.userId,
          topicId: selectedTopic?.id || topics[0]?.id,
          type: "USERPOST",
        });

        if (response) {
          window.alert(t("post.updateSuccess"));
          window.location.href = `/posts/${existingPost.id}`;
        } else {
          console.error("userPost update failed: No response from server.");
        }
      } else {
        const response = await post("/api/posts", {
          title: userPost.title ?? "",
          content: userPost.content ?? "",
          topicId: userPost.topicId,
          type: userPost.type || "USERPOST",
          tagNames: userPost.tagNames || [],
          imageBase64: userPost.imageBase64 || [],
        });

        if (response) {
          window.alert(t("post.createSuccess"));
          window.location.href = "/posts/";
        } else {
          console.error("userPost creation failed: No response from server.");
        }
      }
    } catch (error) {
      console.error("Failed to create userPost", error);
    }
  };

  return (
    <div className="bg-white border rounded-md relative m-10 p-6">
      <form onSubmit={handleSubmit}>
        <div className="gap-6">
          <label className="text-sm font-medium text-gray-900 block mb-2">
            {t("post.topic")}
          </label>
          <TopicSelector
            selectedTopic={selectedTopic}
            onTopicClick={handleTopicClick}
            topics={topics}
          />
          {/* Topic Dropdown */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block py-2">
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
            <label className="text-sm font-medium text-gray-900 block py-2">
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

          <div className="col-span-6 flex flex-wrap items-start gap-4 py-2">
            {/* Tag Selection */}
            <TagsSelector
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />

            {/* Image Upload */}
            <ImageUpload
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              imagePreviews={userPost.imageBase64}
              multiple={true}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 border-t border-gray-200 flex justify-end pt-4">
          <Button
            label={t("post.publish")}
            type="submit"
            className="text-white bg-secondary hover:bg-secondaryPressed font-medium rounded-md text-sm px-5 py-2.5"
          />
        </div>
      </form>
    </div>
  );
}
