import React from "react";
import Button from "@/components/Button";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useTranslation } from "next-i18next";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

interface ImageUploadProps {
  onImageChange: (compressedImage: string) => void;
  onRemoveImage: (index: number) => void;
  imagePreviews: string[];
  multiple: boolean;
}

export default function ImageUpload({
  onImageChange,
  onRemoveImage,
  imagePreviews,
  multiple = false,
}: ImageUploadProps) {
  const { t } = useTranslation("post");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: 1,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);

        reader.onloadend = () => {
          const base64Image = reader.result as string;
          const compressedBase64 = compressToEncodedURIComponent(base64Image);
          const useCompressed =
            compressedBase64.length < base64Image.length
              ? compressedBase64
              : base64Image;
          onImageChange(useCompressed);
        };
      } catch (error) {
        console.error("Failed to upload image", error);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    onRemoveImage(index); // Pass index to the parent to handle removal logic
  };

  return (
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
            multiple={multiple}
          />
          <Button
            label={t("post.addImage")}
            onClick={() => document.getElementById("fileUpload")?.click()}
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md border border-gray-400"
          />
        </div>

        {/* Display Image Preview */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 flex gap-3 flex-wrap">
            {imagePreviews.map((compressed, index) => {
              const base64 = decompressFromEncodedURIComponent(compressed);
              if (!base64) return null;

              return (
                <div key={index} className="relative">
                  <Image
                    src={base64}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="w-24 h-24 object-contain rounded-lg border border-gray-300"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute w-8 h-8 top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✖
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
