"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MagnifyingIcon from "@/public/svg/MagnifyingIcon";
import { useTranslation } from "react-i18next";

export default function SearchBar() {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex px-4 py-0 rounded-full border-2 overflow-hidden font-[sans-serif] bg-white"
    >
      <button type="submit" className="p-2">
        <MagnifyingIcon />
      </button>
      <input
        type="text"
        placeholder={t("navigation.searchSomething")}
        className="w-full outline-none border-none focus:ring-0 bg-transparent text-gray-600 text-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
