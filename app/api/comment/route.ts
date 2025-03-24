import { NextResponse } from "next/server";
import { get, post } from "@/app/lib/fetchInterceptor";

export async function POST(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const commentId = url.includes("/comment/")
    ? urlParts[urlParts.indexOf("comment") + 1]
    : null;

  try {
    const body = await request.json();

    if (commentId === null || isNaN(parseInt(commentId))) {
      return NextResponse.json(
        { message: "Invalid comment ID" },
        { status: 400 }
      );
    }

    switch (true) {
      case url.includes("/toggleLike"):
        const toggleLikeData = await post(
          `/comment/${commentId}/toggleLike`,
          body
        );
        return NextResponse.json(toggleLikeData);

      default:
        return NextResponse.json(
          { message: "Endpoint not found" },
          { status: 404 }
        );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : getErrorMessage(url);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const commentId = url.includes("/comment/")
    ? urlParts[urlParts.indexOf("comment") + 1]
    : null;

  try {
    if (commentId === null || isNaN(parseInt(commentId))) {
      return NextResponse.json(
        { message: "Invalid comment ID" },
        { status: 400 }
      );
    }

    switch (true) {
      case url.includes("/likes"):
        const likesData = await get(`/comment/${commentId}/likes`);
        return NextResponse.json(likesData);

      case url.includes("/isLiked"):
        const isLikedData = await get(`/comment/${commentId}/isLiked`);
        return NextResponse.json(isLikedData);

      default:
        return NextResponse.json(
          { message: "Endpoint not found" },
          { status: 404 }
        );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : getErrorMessage(url);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Helper function to get specific error messages
function getErrorMessage(url: string): string {
  if (url.includes("/toggleLike")) return "Failed to toggle like";
  if (url.includes("/likes")) return "Failed to fetch likes";
  if (url.includes("/isLiked")) return "Failed to check like status";
  return "An error occurred";
}
