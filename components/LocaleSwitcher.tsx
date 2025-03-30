"use client";

import { useTranslation } from "next-i18next";
import { useState } from "react";

const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "fr", label: "🇫🇷 Français" },
];

export default function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language);

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelected(lng);
  };

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-white border border-gray-300 text-sm rounded-md p-2 pr-6 text-black"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
