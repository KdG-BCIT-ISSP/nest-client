"use client";

import SideMenu from "@/components/SideMenu";
import ProfileInputField from "@/components/ProfileInputField";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";

export default function ProfilePage() {
  const [userData] = useAtom(userAtom);

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
