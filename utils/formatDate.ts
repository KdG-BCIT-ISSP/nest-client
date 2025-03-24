import i18n from "i18next";

export const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  const locale = i18n.language || "en";

  return `${d.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}, ${d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
};
