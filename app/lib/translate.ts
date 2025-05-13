export async function translate(text: string, target: string, source = "en") {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("Missing translation key");

  const body = new URLSearchParams({
    text,
    target_lang: target.toUpperCase(),
    ...(source ? { source_lang: source.toUpperCase() } : {}),
  });

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

export async function translateViaApi(
  text: string,
  target: string,
  source = "en"
): Promise<string> {
  if (target === source) return text;
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target, source }),
  });
  if (!res.ok) throw new Error("Local translate API failed");
  const { translated } = await res.json();
  return translated;
}

export async function translateLong(
  text: string,
  target: string,
  source = "en"
): Promise<string> {
  if (target === source || text.length <= 4800) {
    return translateViaApi(text, target, source);
  }
  const CHUNK = 4500;
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK) {
    parts.push(text.slice(i, i + CHUNK));
  }
  const translated = await Promise.all(
    parts.map((p) => translateViaApi(p, target, source))
  );
  return translated.join("");
}
