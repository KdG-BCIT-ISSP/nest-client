export async function translate(text: string, target: string, source = "en") {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("Missing translation key");

  const body = new URLSearchParams({
    text,
    target_lang: target.toUpperCase(),
    ...(source ? { source_lang: source.toUpperCase() } : {}),
  });

  console.log("Translating", text, "to", target, "from", source);

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${key}`,
    },
    body,
  });

  if (!res.ok) {
    console.error("DeepL status", res.status, await res.text());
    throw new Error(`DeepL failed: ${res.statusText}`);
  }
  const { translations } = (await res.json()) as {
    translations: { text: string }[];
  };
  return translations[0].text;
}
