import { NextResponse } from "next/server";
import { get, post, put } from "@/app/lib/fetchInterceptor";

export async function GET(request: Request) {
  const { contentId } = await request.json();
  const url = request.url;

  if (contentId !== null && isNaN(contentId)) {
    return NextResponse.json(
      { message: "Invalid content ID" },
      { status: 400 }
    );
  }

  try {
    switch (true) {
      case url.includes("/isLiked"):
        const isLikedData = await get(`/content/${contentId}/isLiked`);
        return NextResponse.json(isLikedData);

      case url.includes("/likes"):
        const likesData = await get(`/content/${contentId}/likes`);
        return NextResponse.json(likesData);

      case url.includes("/views"):
        const viewsData = await get(`/content/${contentId}/views`);
        return NextResponse.json(viewsData);

      case url.includes("/id/"):
        const contentData = await get(`/content/id/${contentId}`);
        return NextResponse.json(contentData);

      case url.includes("/post/bookmark"):
        const postBookmarkData = await get(`/content/post/bookmark`);
        return NextResponse.json(postBookmarkData);

      case url.includes("/article/bookmark"):
        const articleBookmarkData = await get(`/content/article/bookmark`);
        return NextResponse.json(articleBookmarkData);

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

export async function POST(request: Request) {
  const { contentId } = await request.json();
  const url = request.url;

  if (contentId !== null && isNaN(contentId)) {
    return NextResponse.json(
      { message: "Invalid content ID" },
      { status: 400 }
    );
  }

  try {
    switch (true) {
      case url.includes("/toggleLike"):
        const toggleLikeData = await post(`/content/${contentId}/toggleLike`, {
          contentId,
        });
        return NextResponse.json(toggleLikeData);

      case url.includes("/view"):
        const viewData = await post(`/content/${contentId}/view`, {});
        return NextResponse.json(viewData);

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

export async function PUT(request: Request) {
  const { contentId } = await request.json();
  const url = request.url;

  if (contentId !== null && isNaN(contentId)) {
    return NextResponse.json(
      { message: "Invalid content ID" },
      { status: 400 }
    );
  }

  try {
    switch (true) {
      case url.includes("/toggleBookmark"):
        const bookmarkData = await put(
          `/content/${contentId}/toggleBookmark`,
          {}
        );
        return NextResponse.json(bookmarkData);

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

function getErrorMessage(url: string): string {
  if (url.includes("/isLiked")) return "Failed to check like status";
  if (url.includes("/toggleLike")) return "Failed to toggle like";
  if (url.includes("/likes")) return "Failed to fetch likes";
  if (url.includes("/view")) return "Failed to record view";
  if (url.includes("/views")) return "Failed to fetch views";
  if (url.includes("/toggleBookmark")) return "Failed to update bookmark";
  if (url.includes("/post/bookmark")) return "Failed to get post bookmarks";
  if (url.includes("/article/bookmark"))
    return "Failed to get article bookmarks";
  if (url.includes("/id/")) return "Failed to fetch content by id";
  return "An error occurred";
}
