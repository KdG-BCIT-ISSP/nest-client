// app/api/translate/route.ts
import { NextResponse } from "next/server";

const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

export async function POST(request: Request) {
  try {
    const { text, target } = await request.json();
    if (!text || !target) {
      return NextResponse.json(
        { message: "`text` and `target` are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key not configured");
    }

    const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target,
        format: "text",
      }),
    });

    const payload = await res.json();
    if (!res.ok) {
      // Google returns a JSON error payload with code & message
      const errorMsg =
        payload.error?.message || "Translation API returned an error";
      return NextResponse.json({ message: errorMsg }, { status: res.status });
    }

    const translatedText = payload.data.translations?.[0]?.translatedText;
    return NextResponse.json({ translated: translatedText });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
