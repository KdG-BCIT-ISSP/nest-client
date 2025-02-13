import React, { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import Button from "@/components/Button";
import Image from "next/image";

const AVAILABLE_TAGS = [
  "Tips",
  "Baby",
  "Travel",
  "Food",
  "Health",
  "Education",
  "Fitness",
  "Technology",
];

export default function CreatePost({ title, content }: PostType) {
  const [post, setPost] = useState<PostType>({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Listens for changes in title, subtitle, and content props and updates accordingly.
  useEffect(() => {
    setPost({
      title: title ?? "",
      content: content ?? "",
    });
  }, [title, content]);

  // Cleans up temporary object URLs created for image previews.
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (!post.title?.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!post.content?.trim()) {
      newErrors.content = "Content is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  // Dynamically updates the post state whenever the user types something.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Only take the first file

      // Update state to store only the latest file
      setImages([file]);

      // Update preview, replacing the previous one
      const imageUrl = URL.createObjectURL(file);
      setImagePreviews([imageUrl]);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // Remove tag if clicked again
    } else {
      setSelectedTags([...selectedTags, tag]); // Add tag if not already selected
    }
  };

  // handle post submission (WIP)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const newPost = { ...post, tags: selectedTags, images };
      if (!newPost.id) {
        newPost.id = `post-${Date.now()}`; // Unique ID timestamp? Crypto?
      }
      console.log("Post submitted:", newPost);
    } else {
      console.log("Form is invalid.");
    }
  };

  return (
    <div className="bg-white border rounded-md relative m-10 p-6">
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

          <div className="col-span-6 flex flex-wrap items-start gap-4">
            {/* Tag Selection */}
            <div className="w-full md:w-1/2">
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    type="button"
                    className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${
                      selectedTags.includes(tag)
                        ? "bg-red-300 border-red-500"
                        : "bg-gray-200 border-gray-400"
                    } text-black`}
                  >
                    {tag}{" "}
                    {selectedTags.includes(tag) && (
                      <span className="ml-1">✖</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="w-full md:w-1/2 flex justify-end md:ml-auto">
              <div className="text-right">
                {/* Upload Image Button */}
                <div className="relative inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="fileUpload"
                  />
                  <Button
                    label="Add image"
                    onClick={() =>
                      document.getElementById("fileUpload")?.click()
                    }
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md border border-gray-400"
                  />
                </div>

                {/* Display Image Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 relative">
                    <Image
                      src={imagePreviews[0]}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
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
