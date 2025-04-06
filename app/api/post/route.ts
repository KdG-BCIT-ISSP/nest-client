import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "1";
    const sort = searchParams.getAll("sort");
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("size", size);
    sort.forEach((s) => queryParams.append("sort", s));
    const data = await get(`/posts?${queryParams.toString()}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// POST /api/v1/posts - Create a new post
export async function POST(request: Request) {
  try {
    const { title, content, topicId, type, tagNames, imageBase64 } =
      await request.json();

    if (!title || !content || !topicId || !type) {
      return NextResponse.json(
        { message: "Title, content, topicId, and type are required" },
        { status: 400 }
      );
    }

    const data = await post("/posts", {
      title,
      content,
      topicId,
      type,
      tagNames: tagNames || [],
      imageBase64: imageBase64 || [],
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// PUT /api/v1/posts - Update a post
export async function PUT(request: Request) {
  try {
    const {
      id,
      memberId,
      title,
      content,
      topicId,
      type,
      tagNames,
      imageBase64,
    } = await request.json();

    if (!id || !memberId || !title || !content || !topicId || !type) {
      return NextResponse.json(
        {
          message:
            "ID, memberId, title, content, topicId, and type are required",
        },
        { status: 400 }
      );
    }

    const data = await put("/posts", {
      id,
      memberId,
      title,
      content,
      topicId,
      type,
      tagNames: tagNames || [],
      imageBase64: imageBase64 || [],
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE /api/v1/posts/{postId} - Delete a post
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }
    const data = await del(`/posts/${id}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
