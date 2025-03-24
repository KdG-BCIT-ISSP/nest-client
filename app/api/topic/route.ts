import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

export async function GET() {
  try {
    const data = await get("/topic");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch topics";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    if (pathname.endsWith("/create")) {
      const { name, description } = await request.json();
      if (!name || !description) {
        return NextResponse.json(
          { message: "Name and description are required" },
          { status: 400 }
        );
      }
      const data = await post("/topic/create", { name, description });
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create topic";
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
          { message: "Invalid topic ID" },
          { status: 400 }
        );
      }
      const { name, description } = await request.json();
      if (!name || !description) {
        return NextResponse.json(
          { message: "Name and description are required" },
          { status: 400 }
        );
      }
      const data = await put(`/topic/update/${id}`, {
        name,
        description,
      });
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update topic";
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
          { message: "Invalid topic ID" },
          { status: 400 }
        );
      }
      const data = await del(`/topic/delete/${id}`);
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete topic";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
