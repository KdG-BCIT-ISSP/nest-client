"use client";

import { useEffect, useState } from "react";

export default function CreateContentPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Content Page</h1>
    </div>
  );
}
