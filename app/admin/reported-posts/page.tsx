"use client";

import ReportCard from "@/components/ReportCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";

export default function ReportedPostsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:ml-64 ">
      <SideMenu admin />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4 pb-4">
          Reported Posts
        </h1>
        <div className="flex flex-col gap-6 w-full">
          <ReportCard />
        </div>
      </div>
    </div>
  );
}
