import { NextResponse } from "next/server";
import { get, post, put } from "@/app/lib/fetchInterceptor";

// GET /api/content/[contentId]/isLiked
export async function GET(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await get(`/content/${contentId}/isLiked`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to check like status";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// POST /api/content/[contentId]/toggleLike
export async function POST(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await post(`/content/${contentId}/toggleLike`, { contentId });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to toggle like";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/content/[contentId]/likes
export async function GET_LIKES(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await get(`/content/${contentId}/likes`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch likes";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// POST /api/content/[contentId]/view
export async function POST_VIEW(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await post(`/content/${contentId}/view`, {});
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to record view";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/content/[contentId]/views
export async function GET_VIEWS(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await get(`/content/${contentId}/views`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch views";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// PUT /api/content/[contentId]/toggleBookmark
export async function TOGGLE_BOOKMARK(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await put(`/content/${contentId}/toggleBookmark`, {});
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update bookmark";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/content/post/bookmark
export async function POST_BOOKMARK() {
  try {
    const data = await get(`/content/post/bookmark`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get post bookmarks";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/content/post/bookmark
export async function ARTICLE_BOOKMARK() {
  try {
    const data = await get(`/content/article/bookmark`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to get article bookmarks";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/content/id/[contentId]
export async function GET_CONTENT_ID(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = parseInt(params.contentId);
    if (isNaN(contentId)) {
      return NextResponse.json(
        { message: "Invalid content ID" },
        { status: 400 }
      );
    }

    const data = await get(`/content/id/${contentId}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch content by id";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
