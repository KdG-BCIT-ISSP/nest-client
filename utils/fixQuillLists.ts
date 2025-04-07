export const fixQuillLists = (html: string): string => {
  return html.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match) => {
    return match.includes('data-list="bullet"')
      ? match.replace(/<ol/g, "<ul").replace(/<\/ol>/g, "</ul>")
      : match;
  });
};
