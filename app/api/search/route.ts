import { NextResponse } from "next/server";
import { get } from "@/app/lib/fetchInterceptor";

export async function GET(request: Request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);

    // Base path: /api/search/[type]
    if (segments.length === 3) {
      const type = segments[2];

      const search_query = searchParams.get("search_query") || undefined;
      const topic =
        searchParams.getAll("topic").length > 0
          ? searchParams.getAll("topic")
          : undefined;
      const tag =
        searchParams.getAll("tag").length > 0
          ? searchParams.getAll("tag")
          : undefined;
      const order_by = searchParams.get("order_by") || undefined;
      const order = searchParams.get("order") || undefined;

      const params = new URLSearchParams();
      if (search_query) params.append("search_query", search_query);
      if (topic) topic.forEach((t) => params.append("topic", t));
      if (tag) tag.forEach((t) => params.append("tag", t));
      if (order_by) params.append("order_by", order_by);
      if (order) params.append("order", order);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      if (type === "article") {
        const data = await get(`/api/search/article${queryString}`);
        return NextResponse.json(data);
      }
      if (type === "post") {
        const data = await get(`/api/search/post${queryString}`);
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to perform search";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
