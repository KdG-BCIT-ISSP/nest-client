export const trimContent = (content: string, wordLimit = 50) => {
  const words = content.split(" ");
  if (words.length <= wordLimit) return content;
  return words.slice(0, wordLimit).join(" ") + "...";
};
