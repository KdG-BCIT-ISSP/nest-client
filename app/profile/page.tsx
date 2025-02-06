"use client";

import Image from "next/image";
import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu></SideMenu>
      <div className="flex items-center gap-3 py-2 pl-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <Image
            src="/images/default_profile_image.png"
            className="object-cover rounded-md shrink-0 md:w-16 md:h-16 dark:border-none"
            alt="avatar"
            width={70}
            height={70}
            priority
          />
        </div>

        {/* Text Info Section */}
        <div className="flex flex-col justify-center ml-3">
          <h5 className="text-md">userName</h5>
          <p className="text-gray-500 text-sm">23456@gmail.com</p>
          <button className="mt-2 border-secondary border-2 rounded-md text-sm text-secondary hover:text-white hover:bg-secondary">
            Upload Image
          </button>
        </div>
      </div>
      <ProfileInputField
        username="Alice"
        email="123@gmail.com"
        region="north-america"
      ></ProfileInputField>
    </div>
  );
}
