import { NextResponse } from "next/server";
import { post, put } from "@/app/lib/fetchInterceptor";

export async function PUT(request: Request) {
  const url = request.url;
  const urlParts = url.split("/");
  const resetUID = url.includes("/reset/")
    ? urlParts[urlParts.length - 1]
    : null;

  try {
    const body = await request.json();

    switch (true) {
      case url.includes("/reset/"):
        if (!resetUID) {
          return NextResponse.json(
            { message: "Reset UID is required" },
            { status: 400 }
          );
        }
        const resetData = await put(`/password/reset/${resetUID}`, body);
        return NextResponse.json(resetData);

      case url.includes("/change"):
        const changeData = await put(`/password/change`, body);
        return NextResponse.json(changeData);

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
  const url = request.url;

  try {
    const body = await request.json();

    switch (true) {
      case url.includes("/forgot"):
        const forgotData = await post(`/password/forgot`, body);
        return NextResponse.json(forgotData);

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
  if (url.includes("/reset/")) return "Failed to reset password";
  if (url.includes("/change")) return "Failed to change password";
  if (url.includes("/forgot"))
    return "Failed to process forgot password request";
  return "An error occurred";
}
