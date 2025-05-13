import { translate } from "@/app/lib/translate";

export async function POST(req: Request) {
  try {
    const { text, target, source } = await req.json();
    const translated = await translate(text, target, source);
    return Response.json({ translated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
