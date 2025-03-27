"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { useState, useEffect } from "react";
import { ProfileDataType } from "@/types/ProfileDataType";
import SavedPosts from "@/components/profile/SavedPosts";
import ResetPasswordField from "@/components/profile/ResetPasswordField";
import { useSearchParams } from "next/navigation";

const ProfileView = ({ username, email, region, avatar }: ProfileDataType) => (
  <ProfileInputField
    username={username}
    email={email}
    region={region}
    avatar={avatar}
  />
);

const Notifications = () => <div>Notifications Content</div>;

export default function ProfilePage() {
  const [userData] = useAtom(userAtom);
  const searchParams = useSearchParams();
  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactNode>(null);

  const profileItems = [
    {
      label: "Profile",
      component: <ProfileView {...userData} />,
      onClick: () =>
        setSelectedComponent(
          <ProfileInputField
            username={userData.username}
            email={userData.email}
            region={userData.region}
            avatar={userData.avatar}
          />
        ),
    },
    {
      label: "Saved Posts",
      component: <SavedPosts />,
      onClick: () => setSelectedComponent(<SavedPosts />),
    },
    {
      label: "Notifications",
      component: <Notifications />,
      onClick: () => setSelectedComponent(<Notifications />),
    },
    {
      label: "Reset Password",
      component: <ResetPasswordField />,
      onClick: () => setSelectedComponent(<ResetPasswordField />),
    },
  ];

  useEffect(() => {
    const section = searchParams.get("section");
    switch (section) {
      case "saved-posts":
        setSelectedComponent(<SavedPosts />);
        break;
      case "notifications":
        setSelectedComponent(<Notifications />);
        break;
      case "profile":
      default:
        setSelectedComponent(<ProfileView {...userData} />);
        break;
    }
  }, [searchParams, userData]);

  return (
    <div className="sm:ml-64 bg-white">
      <SideMenu
        customItems={profileItems}
        onItemSelect={(item) => item.onClick && item.onClick()}
      />
      <div className="container mr-auto max-w-5xl">
        {selectedComponent || <ProfileView {...userData} />}
      </div>
    </div>
  );
}
