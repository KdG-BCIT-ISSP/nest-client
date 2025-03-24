import { NextResponse } from "next/server";
import { get, post, del } from "@/app/lib/fetchInterceptor";

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 3) {
      const type = segments[2];

      if (type === "post") {
        const data = await get("/report/post");
        return NextResponse.json(data);
      }
      if (type === "comment") {
        const data = await get("/report/comment");
        return NextResponse.json(data);
      }
      if (type === "article") {
        const data = await get("/report/article");
        return NextResponse.json(data);
      }
    }

    // Specific ID path: /api/v1/report/[type]/[id]
    if (segments.length === 4) {
      const type = segments[2];
      const id = parseInt(segments[3]);

      if (isNaN(id)) {
        return NextResponse.json(
          { message: `Invalid ${type} ID` },
          { status: 400 }
        );
      }

      if (type === "post") {
        const data = await get(`/report/post/${id}`);
        return NextResponse.json(data);
      }
      if (type === "article") {
        const data = await get(`/report/article/${id}`);
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch reports";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);

    // Specific ID path: /api/v1/report/[type]/[id]
    if (segments.length === 4) {
      const type = segments[2];
      const id = parseInt(segments[3]);

      if (isNaN(id)) {
        return NextResponse.json(
          { message: `Invalid ${type} ID` },
          { status: 400 }
        );
      }

      const { reason } = await request.json();
      if (!reason) {
        return NextResponse.json(
          { message: "Reason is required" },
          { status: 400 }
        );
      }

      if (type === "post") {
        const data = await post(`/report/post/${id}`, { reason });
        return NextResponse.json(data);
      }
      if (type === "comment") {
        const data = await post(`/report/comment/${id}`, { reason });
        return NextResponse.json(data);
      }
      if (type === "article") {
        const data = await post(`/report/article/${id}`, { reason });
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create report";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean);

    // DELETE /api/v1/report/[reportId]
    if (segments.length === 3) {
      const reportId = parseInt(segments[2]);

      if (isNaN(reportId)) {
        return NextResponse.json(
          { message: "Invalid report ID" },
          { status: 400 }
        );
      }

      const data = await del(`/report/${reportId}`);
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete report";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
