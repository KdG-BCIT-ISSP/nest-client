// app/api/article/route.ts
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/fetchClient";

export async function POST(request: Request) {
  try {
    const { title, content, topicId, type, tagNames, coverImage } =
      await request.json();
    const backendUrl = `${API_BASE_URL}/article`;

    const apiResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify({
        title,
        content,
        topicId,
        type,
        tagNames,
        coverImage,
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json(
        { message: errorData.message },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Article creation failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
