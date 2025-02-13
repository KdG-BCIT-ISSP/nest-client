"use client";

import { useEffect, useState } from "react";
import ViewPost from "@/components/ViewPost";

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
      <ViewPost />
    </div>
  );
}
