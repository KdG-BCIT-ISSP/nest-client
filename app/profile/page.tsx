"use client";

import Image from "next/image";
import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useEffect, useState } from "react";
import { getProfile } from "../api/profile/get/route";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    region: "",
    avatar: "/images/default_profile_image.png",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchData();
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
