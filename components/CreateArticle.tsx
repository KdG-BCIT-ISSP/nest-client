"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import { ArticleType } from "@/types/ArticleType";
import TagsSelector from "./TagsSelector";
import imageCompression from "browser-image-compression";
import { createArticle } from "@/app/api/article/create/route";

export default function CreateArticle() {
  const [article, setArticle] = useState<ArticleType>({
    title: "",
    content: "",
    tags: [],
    topicId: 2,
    type: "ARTICLE",
    image: "", // Stores uploaded image
    imagePreview: "", // Stores preview URL
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
        : `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
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
              image: reader.result as string,
              imagePreview: URL.createObjectURL(file),
            });

            setErrors((prevErrors) => ({
              ...prevErrors,
              image: "", // Clear the error message
            }
            ));
          }

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
      content: value.trim() ? "" : "Content is required.",
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
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!article.image) {
      newErrors.image = "Please upload an image.";
      isValid = false;
    }

    if (!article.content?.trim()) {
      newErrors.content = "Content is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Submitting Article:", article);
    const encodedContent = encodeURIComponent(article.content);
    console.log("Encoded Content:", encodedContent);

    try {
      console.log("title:", article.title);
      console.log("content:", article.content);
      console.log("tags:", article.tags);
      console.log("image:", article.image);

      const response = await createArticle(
        article.title,
        encodedContent,
        article.topicId,
        article.type,
        article.tags,
        article.image
      )

      if (response) {
        console.log("Article Created:", response);
        window.alert("Article created successfully");
      } else {
        console.error("Post creation failed: No response from server.");
      }
    } catch (error) {
      console.error("Failedddd to create article", error);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // Remove tag if clicked again
      article.tags = article.tags.filter((t) => t !== tag);
    } else {
      setSelectedTags([...selectedTags, tag]); // Add tag if not already selected
      article.tags = [...article.tags, tag];
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 lg:p-12 rounded-lg shadow-md my-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center justify-between gap-6">
          {/* Title Input */}
          <div className="w-3/5 flex flex-col">
            <label className="block text-lg font-medium text-black">
              Title
            </label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => handleChange(e, "title")}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md text-black h-12"
              placeholder="Enter article title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

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
                label="Add Cover Image"
                onClick={() => document.getElementById("fileUpload")?.click()}
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 h-12 flex items-center rounded-md border border-gray-400"
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
          <label className="block text-lg font-medium text-black">
            Content
          </label>
          <ReactQuill
            value={article.content}
            onChange={handleContentChange}
            className="mt-2 bg-white text-black"
            theme="snow"
            placeholder="Write your article content here..."
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
            label="Publish Article"
            onClick={handleSubmit}
            className="text-white bg-red-500 h-12 hover:bg-red-600 font-medium rounded-md text-lg px-6 py-3"
          />
        </div>
      </form>

      {/* HTML Preview */}
      <div className="prose mt-8 border-t border-gray-200 pt-6 text-black">
        {" "}
        <h3>Article HTML Preview:</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{article.content}</pre>
      </div>
    </div>
  );
}
