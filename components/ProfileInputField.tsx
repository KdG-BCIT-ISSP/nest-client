
"use client";

import { ProfileDataType } from "@/types/ProfileDataType";
import { updateProfile } from "@/app/api/profile/update/route";
import { useState } from "react";
import React from 'react';
import Image from "next/image";
import { getProfile } from "@/app/api/profile/get/route";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";


const REGION_VALUES = [
  { value: "", label: "Select a region" },
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "south-america", label: "South America" },
];

export default function ProfileInputField({
  username,
  email,
  region,
  avatar,
}: ProfileDataType) {

  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    region: region || "",
    avatar: avatar || "",
  });

  const [errors, setErrors] = useState<{ username: string; region: string }>({ username: "", region: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setUserData] = useAtom(userAtom);

  console.log(avatar)

  // 2 things
  // 1. validate form - username should be at least 4 characters and not exceed 13 characters
  // 2. optimize image before uploading or sending to the server
  // 3. Make sure to display the imagePreview over the avatar image when user selects an image from folder
  // 4. email field should not be editable - means it should not be clickable


  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", region: "" };

    if (!formData.username) {
      newErrors.username = "Username can not be empty";
      isValid = false;
    }
    if (formData.username.length > 13 || formData.username.length < 4) {
      newErrors.username = "Characters can not less than 4 and exceed 13";
      isValid = false;
    }

    if (!formData.region) {
      newErrors.region = "Please select a region";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagePreview(reader.result as string);
          setFormData({ ...formData, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);

    }


  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!validateForm()) return;


    try {
      const response = await updateProfile(formData.username, formData.region, formData.avatar);

      if (response) {
        setFormData((prev) => ({
          ...prev,
          username: response.username || prev.username,
          region: response.region || prev.region,
          avatar: response.avatar !== undefined ? response.avatar : prev.avatar,
        }));

        if (response.avatar) {
          setImagePreview(response.avatar);
        }
      }

      const data = await getProfile();
      console.log(data);
      setUserData(data);
      console.log(response)
      setMessage("Profile updated successfully!");
      window.alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update profile.");
      window.alert("Profile updated failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <div className="bg-white border border-2 rounded-md relative m-10">
      <div className="flex items-center gap-3 py-2 pl-10 pt-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <Image
            src={imagePreview || avatar || "/images/default_profile_image.png"}
            className="object-cover rounded-full shrink-0 md:w-16 md:h-16 dark:border-none"
            alt="avatar"
            width={70}
            height={70}
            priority
          />
        </div>

        {/* Text Info Section */}
        <div className="flex flex-col justify-center ml-3">
          <h5 className="text-md text-gray-600">{formData.username}</h5>
          <p className="text-gray-500 text-sm">{formData.email}</p>
          <button className="mt-2 border-secondary border-2 rounded-md text-sm text-secondary hover:text-white hover:bg-secondary"
            onClick={() => document.getElementById("imageInput")?.click()}>
            Upload Image
          </button>
          <input
            type="file"
            id="imageInput"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Email
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg block w-full p-2.5 bg-gray-100 pointer-events-none focus:outline-none"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="brand"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Region
              </label>
              <select
                name="region"
                id="region"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                value={formData.region}
                onChange={handleChange}
              >
                {REGION_VALUES.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-sm">{errors.region}</p>
              )}
            </div>
          </div>
          <div className="p-6 mt-6 border-t border-gray-200 flex justify-end">
            <button
              className="text-white bg-secondary hover:bg-tertiary font-medium rounded-md text-sm px-5 py-2.5 text-center"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
