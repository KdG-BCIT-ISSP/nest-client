export function decodeAndTruncateHtml(
  encodedHtml: string,
  maxLength: number = 100
): string {
  const decoded = decodeURIComponent(encodedHtml);
  const plainText = decoded.replace(/<[^>]+>/g, "");
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + "..."
    : plainText;
}
