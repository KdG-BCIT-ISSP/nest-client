import React, { useState, useEffect } from "react";
import { CreatePostType } from "@/types/CreatePostType";
import Button from "@/components/Button";

export default function CreatePost({
  title,
  subtitle,
  content,
}: CreatePostType) {
  const [post, setPost] = useState<CreatePostType>({
    title: title ?? "",
    subtitle: subtitle ?? "",
    content: content ?? "",
  });

  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    content: "",
  });

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    setPost({
      title: title ?? "",
      subtitle: subtitle ?? "",
      content: content ?? "",
    });
  }, [title, subtitle, content]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", subtitle: "", content: "" };

    if (!post.title.trim()) {
      newErrors.title = "Title cannot be empty";
      isValid = false;
    }
    if (!post.subtitle.trim()) {
      newErrors.subtitle = "Subtitle cannot be empty";
      isValid = false;
    }
    if (!post.content.trim()) {
      newErrors.content = "Content cannot be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Post submitted:", post, images);
    } else {
      console.log("Form is invalid.");
    }
  };

  return (
    <div className="bg-white border border-2 rounded-md relative m-10 p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-6">
          {/* Title Input */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={post.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Subtitle Input */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              value={post.subtitle}
              onChange={handleChange}
            />
            {errors.subtitle && (
              <p className="text-red-500 text-sm">{errors.subtitle}</p>
            )}
          </div>

          {/* Content Input */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Content
            </label>
            <textarea
              name="content"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 h-32"
              value={post.content}
              onChange={handleChange}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="col-span-6">
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="block w-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 border-t border-gray-200 flex justify-end pt-4">
          <Button
            label="Post"
            onClick={handleSubmit}
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-sm px-5 py-2.5"
          />
        </div>
      </form>
    </div>
  );
}
