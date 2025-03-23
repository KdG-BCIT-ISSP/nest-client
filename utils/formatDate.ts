export const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  return `${d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}, ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
};
