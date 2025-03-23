"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation("common");

  // Delay render until i18n is ready
  if (!i18n.isInitialized) return null;

  return (
    <footer className="bg-tertiary text-white py-4 flex justify-between items-center px-6 z-30">
      <span className="text-xl font-semibold whitespace-nowrap text-white">
        LOGO
      </span>
      <p className="text-xs">
        © {new Date().getFullYear()} KDG Research Center.{" "}
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
