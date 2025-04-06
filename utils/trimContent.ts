export const trimContent = (content: string, wordLimit = 50) => {
  const words = content.split(" ");
  if (words.length <= wordLimit) return content;
  return words.slice(0, wordLimit).join(" ") + "...";
};

export function decodeAndTrim(content: string, wordLimit = 30): string {
  try {
    const decoded = decodeURIComponent(content);
    const plainText = decoded.replace(/<[^>]+>/g, "");
    return trimContent(plainText, wordLimit);
  } catch (error) {
    console.error("Failed to decode content:", error);
    const plainText = content.replace(/<[^>]+>/g, "");
    return trimContent(plainText, wordLimit);
  }
}
