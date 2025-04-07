import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await post("/article", body);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Article creation failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname.endsWith("/stats")) {
    try {
      const data = await get("/article/stats");
      return NextResponse.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch article stats";
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
  }

  try {
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "1";
    const sort = searchParams.getAll("sort");
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("size", size);
    sort.forEach((s) => queryParams.append("sort", s));
    const data = await get(`/article?${queryParams.toString()}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await put("/article", body);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Article update failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "Article ID is required" },
        { status: 400 }
      );
    }
    const data = await del(`/article/${id}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Article deletion failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
