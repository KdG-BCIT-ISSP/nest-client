import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

export async function GET() {
  try {
    const data = await get("/tag");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tags";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    if (pathname.endsWith("/create")) {
      const { name } = await request.json();
      if (!name) {
        return NextResponse.json(
          { message: "Tag name is required" },
          { status: 400 }
        );
      }
      const data = await post("/tag/create", { name });
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create tag";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 4 && segments[2] === "update") {
      const id = parseInt(segments[3]);
      if (isNaN(id)) {
        return NextResponse.json(
          { message: "Invalid tag ID" },
          { status: 400 }
        );
      }
      const { name } = await request.json();
      if (!name) {
        return NextResponse.json(
          { message: "Tag name is required" },
          { status: 400 }
        );
      }
      const data = await put(`/tag/update/${id}`, { name });
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update tag";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 4 && segments[2] === "delete") {
      const id = parseInt(segments[3]);
      if (isNaN(id)) {
        return NextResponse.json(
          { message: "Invalid tag ID" },
          { status: 400 }
        );
      }
      const data = await del(`/tag/delete/${id}`);
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete tag";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
