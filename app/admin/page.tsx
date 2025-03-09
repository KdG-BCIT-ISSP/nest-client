"use client";

import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <SideMenu admin />
    </div>
  );
}
