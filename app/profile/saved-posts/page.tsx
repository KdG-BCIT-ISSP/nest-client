"use client";
import PostCard from "@/components/PostCard";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";

export default function SavedPostsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:ml-64">
      <SideMenu />
      <div className="pl-0 p-8 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-black mb-4">Saved Posts</h1>
        <div className="flex flex-col gap-6 w-full">
          <PostCard
            className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
            title={"5 Healhty Snacks for Nursing Moms"}
            content={
              "Nursing moms often find themselves feeling hungry throughout the day, and healthy snacks can provide the fuel needed to keep going. Greek yogurt with fresh fruit is an excellent choice, offering both protein and calcium."
            }
            topicId={0}
            tags={[]}
            images={"/images/pregnancy1.jpg"}
            postImages={["/images/pregnancy1.jpg"]}
            saved
          />
          <PostCard
            className="bg-container flex-shrink-0 w-full max-w-5xl ml-0 container"
            title={"5 Healhty Snacks for Nursing Moms"}
            content={
              "Nursing moms often find themselves feeling hungry throughout the day, and healthy snacks can provide the fuel needed to keep going. Greek yogurt with fresh fruit is an excellent choice, offering both protein and calcium."
            }
            topicId={0}
            tags={[]}
            images={"/images/pregnancy1.jpg"}
            postImages={["/images/pregnancy1.jpg"]}
            saved
          />
        </div>
      </div>
    </div>
  );
}
