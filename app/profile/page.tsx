"use client";

import Image from "next/image";
import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    username: "Alice",
    email: "123@gmail.com",
    region: "north-america",
    avatar: "/images/default_profile_image.png",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <div className="container mr-auto max-w-5xl">
        <ProfileInputField
          username={userData.username}
          email={userData.email}
          region={userData.region}
        ></ProfileInputField>
      </div>
    </div>
  );
}
