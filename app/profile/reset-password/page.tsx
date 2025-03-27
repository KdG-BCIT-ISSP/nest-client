"use client";

import SideMenu from "@/components/SideMenu";
import ResetPasswordField from "@/components/ResetPasswordField";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";

export default function ProfilePage() {
  const [userData] = useAtom(userAtom);

  return (
    <div className="p-4 sm:ml-64 bg-white">
      <SideMenu />
      <div className="container mr-auto max-w-5xl">
        <ResetPasswordField />
      </div>
    </div>
  );
}