import React, { useState, useEffect } from "react";
import { PostType } from "@/types/PostType";
import Button from "@/components/Button";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { createPost } from "@/app/api/post/create/route";

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

export default function CreatePost() {

  const [isLoading, setIsLoading] = useState(false);

  const [post, setPost] = useState<PostType>({
    title: "",
    content: "",
    tags: [],
    topicId: 2,
    type: "USERPOST",
    coverImage: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Listens for changes in title, subtitle, and content props and updates accordingly.
  // useEffect(() => {
  //   setPost({
  //     title: post.title || "",
  //     content: post.content || "",
  //   });
  // }, [post.title, post.content]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImages([file]);
      setImagePreviews([URL.createObjectURL(file)]);

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviews([reader.result as string]);
            console.log("before:", post.coverImage);
            setPost((prevPost) => {
              const updatedPost = { ...prevPost, coverImage: reader.result as string };
              console.log("after:", updatedPost.coverImage);
              return updatedPost;
            });
          }
        };
        reader.readAsDataURL(file);

      } catch (error) {
        console.error("Failed to upload image", error);
      }


      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]; // Only take the first file

        // Update state to store only the latest file
        setImages([file]);

        // Update preview, replacing the previous one
        const imageUrl = URL.createObjectURL(file);
        setImagePreviews([imageUrl]);
        console.log(":", post.coverImage);


        imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        })
          .then((compressedFile) => {
            // Create a FileReader to read the image and convert it to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);

            reader.onloadend = () => {
              // Get base64 string
              const base64Image = reader.result as string;

              // Update state with the base64 image
              setPost({ ...post, coverImage: base64Image });

            };
          })
          .catch((error) => {
            console.error("Image compression failed:", error);
          });
      }
    }
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

  const handleRemoveImage = () => {
    setImagePreviews([]);
    post.coverImage = "";
  };


  // handle post submission (WIP)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    console.log("Post:", post);

    if (!validateForm()) return;
    const updatedPost = { ...post, tags: selectedTags };
    try {
      console.log("title:", post.title);
      console.log("content:", post.content);
      console.log("topicId:", post.topicId);
      console.log("tags:", post.tags);
      console.log("coverImage:", post.coverImage);
      const response = await createPost(post.title, post.content, post.topicId, post.type, post.tags, post.coverImage);


      if (response) {
        console.log("Post created successfully:", response);
        console.log(response);
        window.alert("Post created successfully");
        // window.location.href = `/posts/`;
      } else {
        console.error("Post creation failed: No response from server.");
      }
    } catch (error) {
      console.error("Failedddd to upload image", error);
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
                    className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${selectedTags.includes(tag)
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
                    {/* Add Remove Button */}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute w-8 h-8 top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✖
                    </button>
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
            type="submit"
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-md text-sm px-5 py-2.5"
          />
        </div>
      </form>
    </div>
  );
}
