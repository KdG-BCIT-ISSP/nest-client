"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function CreateArticle() {
  const [article, setArticle] = useState({
    title: "",
    content: "",
    image: null as File | null, // Stores uploaded image
    imagePreview: "", // Stores preview URL
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
  });

  // Handle Title Change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, title: e.target.value });

    // Live validation
    setErrors((prevErrors) => ({
      ...prevErrors,
      title: e.target.value.trim() ? "" : "Title is required.",
    }));
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setArticle({ ...article, image: file, imagePreview: imageUrl });
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Submitting Article:", article);

    // TODO: Send `article` data to backend (API request)
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
              onChange={handleTitleChange}
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
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 border-t border-gray-200 flex justify-end pt-6">
          <Button
            label="Publish Article"
            onClick={handleSubmit}
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-lg px-6 py-3"
          />
        </div>
      </form>
    </div>
  );
}
