import React, { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import Button from "@/components/Button";
import TagsSelector from "./TagsSelector";
import { createPost } from "@/app/api/post/create/route";
import ImageUpload from "./ImageUpload";

export default function CreatePost() {
  const [isLoading, setIsLoading] = useState(false);

  const [post, setPost] = useState<PostType>({
    title: "",
    content: "",
    tags: [],
    topicId: 2,
    type: "USERPOST",
    postImages: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // Remove tag if clicked again
      post.tags = post.tags.filter((t) => t !== tag);
    } else {
      setSelectedTags([...selectedTags, tag]); // Add tag if not already selected
      post.tags = [...post.tags, tag];
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    setPost((prevPost) => ({
      ...prevPost,
      postImages: prevPost.postImages.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (compressedImage: string) => {
    const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setImagePreviews((prevPreviews) => [...prevPreviews, compressedImage]);

    setPost((prevPost) => ({
      ...prevPost,
      postImages: [...prevPost.postImages, compressedImage], // Ensure this is valid type
    }));
  };

  // Dynamically updates the post state whenever the user types something.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // handle post submission (WIP)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    console.log("Post:", post);

    if (!validateForm()) return;
    const updatedPost = { ...post, tags: selectedTags }; // Create updatedPost

    try {
      console.log("title:", updatedPost.title); //Log the updated post.
      console.log("content:", updatedPost.content);
      console.log("topicId:", updatedPost.topicId);
      console.log("tags:", updatedPost.tags);
      console.log("image:", post.postImages[0]);
      console.log("image:", post.postImages[1]);

      const response = await createPost(
        updatedPost.title,
        updatedPost.content,
        updatedPost.topicId,
        updatedPost.type || "USERPOST",
        updatedPost.tags,
        post.postImages
      );

      if (response) {
        console.log("Post created successfully:", response);
        window.alert("Post created successfully");
        // window.location.href = `/posts/`;
      } else {
        console.error("Post creation failed: No response from server.");
      }
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsLoading(false);
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
            label="Post"
            type="submit"
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-sm px-5 py-2.5"
          />
        </div>
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
}
