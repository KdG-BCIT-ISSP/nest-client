"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";

export default function AdminPage() {
  return (
    <div className="p-6">
      <SideMenu admin />
    </div>
  );
}
