"use client";

import { useEffect, useState } from "react";
import ViewPost from "@/components/ViewPost";
import PostCard from "@/components/PostCard";

export default function CreateViewPostPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Post</h1>
      <ViewPost
        author="Jane Doe"
        title="Surviving Sleepless Nights: Tips for New Mothers"
        content="Sleepless nights can be one of the most challenging parts of being a new mom. It's essential to find moments to rest, even when it feels impossible."
      />
      <PostCard
        author="Wonder Woman"
        title="Breastfeeding Tips for New Mothers"
        content="Breastfeeding can be challenging but rewarding. Learn about proper latching techniques, maintaining milk supply, and seeking support when needed..."
      />
    </div>
  );
}
