"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import { ArticleType } from "@/types/ContentType";
import TagsSelector from "./TagsSelector";
import imageCompression from "browser-image-compression";
import { useTranslation } from "next-i18next";
import { post } from "@/app/lib/fetchInterceptor";
import { Topic } from "@/types/Topic";
import TopicSelector from "./TopicSelector";

export default function CreateArticle() {
  const { t, i18n } = useTranslation("article");
  const [article, setArticle] = useState<ArticleType>({
    id: 0,
    title: "",
    content: "",
    tagNames: [],
    topicId: 1,
    type: "ARTICLE",
    coverImage: "", // Stores uploaded image
    memberUsername: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();
  const [topics, setTopics] = useState<Topic[]>([]);

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
          setArticle((prev) => ({
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
    setArticle((prevArticle) => ({
      ...prevArticle,
      topicId: topic.id,
    }));
  };

  // Handle Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "title"
  ) => {
    const value = e.target.value;
    setArticle({ ...article, [field]: value });

    // Live validation
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim()
        ? ""
        : t("article.requiredField", { field: t(`article.${field}`) }),
    }));
  };
  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      imageCompression(file, options)
        .then((compressedFile) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onload = () => {
            setArticle({
              ...article,
              coverImage: reader.result as string,
              imagePreview: URL.createObjectURL(file),
            });

            setErrors((prevErrors) => ({
              ...prevErrors,
              image: "", // Clear the error message
            }));
          };
        })
        .catch((error) => {
          console.error("Image compression failed:", error);
        });
    }
  };

  // Handle Content Change in React-Quill
  const handleContentChange = (value: string) => {
    setArticle({ ...article, content: value });

    // Live validation for quill content
    setErrors((prevErrors) => ({
      ...prevErrors,
      content: value.trim() ? "" : t("article.contentRequired"),
    }));
  };

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (article.imagePreview) {
        URL.revokeObjectURL(article.imagePreview);
      }
    };
  }, [article.imagePreview]);

  // Validate Form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "", image: "" };

    if (!article.title?.trim()) {
      newErrors.title = t("article.titleRequired");
      isValid = false;
    }

    if (!article.coverImage) {
      newErrors.image = t("article.imageRequired");
      isValid = false;
    }

    if (!article.content?.trim()) {
      newErrors.content = t("article.contentRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    const encodedContent = encodeURIComponent(article.content);

    try {
      const articleData = {
        title: article.title,
        content: encodedContent,
        topicId: article.topicId,
        type: article.type,
        tagNames: article.tagNames,
        coverImage: article.coverImage,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await post("/api/article", articleData);

      window.alert(t("article.createSuccess"));
      window.location.href = "/curated-articles/";
    } catch (error: unknown) {
      console.error("Failed to create article:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      window.alert(`Failed to create article: ${errorMessage}`);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // Remove tag if clicked again
      article.tagNames = article.tagNames?.filter((t) => t !== tag) ?? [];
    } else {
      setSelectedTags([...selectedTags, tag]); // Add tag if not already selected
      article.tagNames = [...(article.tagNames ?? []), tag];
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 lg:p-12 rounded-lg shadow-md my-10">
      <form onSubmit={handleSubmit}>
        {/* Topic Dropdown */}
        <div className="mb-6 flex items-center justify-between gap-6">
          <label className="text-sm font-medium text-gray-900 block mb-2">
            {t("article.topic")}
          </label>
          <TopicSelector
            selectedTopic={selectedTopic || undefined}
            onTopicClick={handleTopicClick}
            topics={topics}
          />
          <label className="text-sm font-medium text-gray-900 block mb-2">
            {t("article.title")}
          </label>
          <input
            type="text"
            value={article.title}
            onChange={(e) => handleChange(e, "title")}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md h-12"
            placeholder={t("article.titlePlaceholder")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}

          <div className="w-2/5 flex flex-col items-center gap-10">
            {/* Upload Button */}
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="fileUpload"
              />
              {errors.image && ( // Display image error message
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
              <Button
                label={t("article.addCoverImage")}
                onClick={() => document.getElementById("fileUpload")?.click()}
                type="button"
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 h-12 flex items-center rounded-md border border-gray-400"
              />
            </div>

            {/* Image Preview */}
            {article.imagePreview && (
              <div className="w-40 h-40 flex items-center justify-center">
                <Image
                  src={article.imagePreview}
                  alt="Image Preview"
                  width={160}
                  height={160}
                  className="rounded-md border border-gray-300 object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        {/* React-Quill Text Editor */}
        <div className="mb-6">
          <label className="block text-lg font-medium ">
            {t("article.content")}
          </label>
          <ReactQuill
            key={i18n.language}
            value={article.content}
            onChange={handleContentChange}
            className="mt-2 bg-white "
            theme="snow"
            placeholder={t("article.contentPlaceholder")}
            style={{ height: "400px" }}
            modules={{
              toolbar: [
                [{ font: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ script: "sub" }, { script: "super" }],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
                ["link", "image", "video"],
                ["clean"],
              ],
            }}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 border-t border-gray-200 flex justify-between pt-6">
          <TagsSelector
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
          <Button
            label={t("article.publish")}
            onClick={handleSubmit}
            className="text-white bg-red-500 h-12 hover:bg-red-600 font-medium rounded-md text-lg px-6 py-3"
          />
        </div>
      </form>

      {/* HTML Preview */}
      <div className="prose mt-8 border-t border-gray-200 pt-6 ">
        {" "}
        <h3>{t("article.preview")}</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{article.content}</pre>
      </div>
    </div>
  );
}
