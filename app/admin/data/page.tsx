"use client";
export const dynamic = "force-dynamic";

import SideMenu from "@/components/SideMenu";

export default function DataPage() {
  return (
    <div className="flex">
      <SideMenu admin />
      <div className="p-4 sm:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-4">Statistics Page</h1>
      </div>
    </div>
  );
}
