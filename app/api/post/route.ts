import { NextResponse } from "next/server";
import { get, post, put, del } from "@/app/lib/fetchInterceptor";

// GET /api/v1/posts - Get all posts
export async function GET() {
  try {
    const data = await get("/posts");
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

    // Validation
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

    // Validation
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
export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const data = await del(`/posts/${postId}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
