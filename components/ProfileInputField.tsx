"use client";
export const dynamic = "force-dynamic";

import { ProfileDataType } from "@/types/ProfileDataType";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { useTranslation } from "next-i18next";
import { get, put } from "@/app/lib/fetchInterceptor";
import ImageUpload from "./ImageUpload";
import Button from "./Button";

export default function ProfileInputField({
  username,
  email,
  region,
  avatar,
}: ProfileDataType) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    region: region || "",
    avatar: avatar || "",
  });

  const REGION_VALUES = [
    { value: "", label: t("profile.selectRegion") },
    { value: "north-america", label: t("profile.northAmerica") },
    { value: "europe", label: t("profile.europe") },
    { value: "south-america", label: t("profile.southAmerica") },
  ];

  const [errors, setErrors] = useState<{ username: string; region: string }>({
    username: "",
    region: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setUserData] = useAtom(userAtom);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", region: "" };

    if (!formData.username) {
      newErrors.username = t("profile.usernameRequired");
      isValid = false;
    }
    if (formData.username.length > 13 || formData.username.length < 4) {
      newErrors.username = t("profile.usernameLength");
      isValid = false;
    }

    if (!formData.region) {
      newErrors.region = t("profile.regionRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleAvatarChange = async (image: string) => {
    setFormData((prev) => ({ ...prev, avatar: image }));
    setImagePreview(image);
    try {
      await put("/api/member/me", { avatar: image });
      const updated = await get("/api/member/me");
      setUserData(updated);
    } catch (error) {
      console.error("Failed to auto-save avatar", error);
    }
  };

  const handleAvatarRemove = async () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
    setImagePreview(null);
    try {
      await put("/api/member/me", { avatar: "" });
      const updated = await get("/api/member/me");
      setUserData(updated);
    } catch (error) {
      console.error("Failed to remove avatar", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await put("/api/member/me", {
        username: formData.username,
        region: formData.region,
        avatar: formData.avatar,
      });

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

      const data = await get("/api/member/me");
      setUserData(data);
      window.alert(t("profile.updateSuccess"));
    } catch (error) {
      console.error("Update failed:", error);
      window.alert(t("profile.updateError"));
    } finally {
    }
  };

  return (
    <div className="bg-white border-2 rounded-md relative m-10">
      <div className="flex items-center gap-3 py-2 pl-10 pt-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <Image
            src={imagePreview || avatar || "/images/default_profile_image.png"}
            className="object-cover rounded-full shrink-0 md:w-16 md:h-16"
            alt="avatar"
            width={70}
            height={70}
            priority
          />
          <Button
            onClick={() =>
              document.getElementById("profileImageUpload")?.click()
            }
            className="mt-2 p-2 border-secondary border-2 rounded-md text-sm text-secondary hover:text-white hover:bg-secondary"
          >
            {t("profile.uploadImage")}
          </Button>
        </div>

        {/* Text Info Section */}
        <div className="flex flex-col justify-center ml-3">
          <h5 className="text-md text-gray-600">{formData.username}</h5>
          <p className="text-gray-500 text-sm">{formData.email}</p>
          <ImageUpload
            onImageChange={handleAvatarChange}
            onRemoveImage={handleAvatarRemove}
            imagePreviews={formData.avatar ? [formData.avatar] : []}
            multiple={false}
            triggerId="profileImageUpload"
            button={<></>} // disables internal button
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
                {t("profile.username")}
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
                {t("profile.email")}
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg block w-full p-2.5 pointer-events-none focus:outline-none"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="brand"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t("profile.region")}
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
              {t("profile.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
