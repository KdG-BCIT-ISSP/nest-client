import React from "react";
import Button from "@/components/Button";
import Image from "next/image";
import imageCompression from "browser-image-compression";


interface ImageUploadProps {
    onImageChange: (compressedImage: string) => void;
    onRemoveImage: () => void;
    imagePreviews: string[];
}

export default function ImageUpload({ onImageChange, onRemoveImage, imagePreviews }: ImageUploadProps) {


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 500,
                    useWebWorker: true,
                };



                imageCompression(file, options)
                    .then((compressedFile) => {
                        // Create a FileReader to read the image and convert it to base64
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedFile);

                        reader.onloadend = () => {
                            // Get base64 string
                            const base64Image = reader.result as string;
                            
                            onImageChange(base64Image);
                        };
                    })
                    .catch((error) => {
                        console.error("Image compression failed:", error);
                    });
            } catch (error) {
                console.error("Failed to upload image", error);
            }
    }
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
                        onClick={onRemoveImage}
                        className="absolute w-8 h-8 top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>
    </div>
)
}















