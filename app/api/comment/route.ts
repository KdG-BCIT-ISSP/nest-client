import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

export async function GET(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const slug = urlParts.slice(urlParts.indexOf("comment") + 1);

  try {
    // Handle /api/comment/{commentId}
    if (slug.length === 1) {
      const commentId = slug[0];
      if (!commentId || isNaN(parseInt(commentId))) {
        return NextResponse.json(
          { message: "Invalid comment ID" },
          { status: 400 }
        );
      }
      const commentData = await get(`/comment/${commentId}`);
      return NextResponse.json(commentData);
    }

    // Handle /api/comment/{commentId}/likes
    if (slug.length === 2 && slug[1] === "likes") {
      const commentId = slug[0];
      if (!commentId || isNaN(parseInt(commentId))) {
        return NextResponse.json(
          { message: "Invalid comment ID" },
          { status: 400 }
        );
      }
      const likesData = await get(`/comment/${commentId}/likes`);
      return NextResponse.json(likesData);
    }

    // Handle /api/comment/{commentId}/isLiked
    if (slug.length === 2 && slug[1] === "isLiked") {
      const commentId = slug[0];
      if (!commentId || isNaN(parseInt(commentId))) {
        return NextResponse.json(
          { message: "Invalid comment ID" },
          { status: 400 }
        );
      }
      const isLikedData = await get(`/comment/${commentId}/isLiked`);
      return NextResponse.json(isLikedData);
    }

    return NextResponse.json(
      { message: "Endpoint not found" },
      { status: 404 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : getErrorMessage(url);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const slug = urlParts.slice(urlParts.indexOf("comment") + 1);

  try {
    const body = await request.json();

    // Handle /api/comment (create new comment)
    if (slug.length === 0) {
      const commentData = await post(`/comment`, body);
      return NextResponse.json(commentData);
    }

    // Handle /api/comment/{commentId}/toggleLike
    if (slug.length === 2 && slug[1] === "toggleLike") {
      const commentId = slug[0];
      if (!commentId || isNaN(parseInt(commentId))) {
        return NextResponse.json(
          { message: "Invalid comment ID" },
          { status: 400 }
        );
      }
      const toggleLikeData = await post(
        `/comment/${commentId}/toggleLike`,
        body
      );
      return NextResponse.json(toggleLikeData);
    }

    return NextResponse.json(
      { message: "Endpoint not found" },
      { status: 404 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : getErrorMessage(url);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const slug = urlParts.slice(urlParts.indexOf("comment") + 1);

  try {
    const body = await request.json();

    // Handle /api/comment (update comment)
    if (slug.length === 0) {
      const commentData = await put(`/comment`, body);
      return NextResponse.json(commentData);
    }

    return NextResponse.json(
      { message: "Endpoint not found" },
      { status: 404 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : getErrorMessage(url);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const slug = urlParts.slice(urlParts.indexOf("comment") + 1);

  try {
    // Handle /api/comment/{commentId}
    if (slug.length === 1) {
      const commentId = slug[0];
      if (!commentId || isNaN(parseInt(commentId))) {
        return NextResponse.json(
          { message: "Invalid comment ID" },
          { status: 400 }
        );
      }
      const deleteData = await del(`/comment/${commentId}`);
      return NextResponse.json(deleteData);
    }

    return NextResponse.json(
      { message: "Endpoint not found" },
      { status: 404 }
    );
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
  if (url.includes("/comment") && !url.includes("/"))
    return "Failed to create or update comment";
  return "An error occurred";
}
