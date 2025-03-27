"use client";

import SideMenu from "@/components/SideMenu";
import ResetPasswordField from "@/components/ResetPasswordField";

export default function ProfilePage() {
  return (
    <div className="p-4 sm:ml-64 bg-white">
      <SideMenu />
      <div className="container mr-auto max-w-5xl">
        <ResetPasswordField />
      </div>
    </div>
  );
}
