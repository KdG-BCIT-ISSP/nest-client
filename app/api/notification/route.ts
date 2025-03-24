import { NextResponse } from "next/server";
import { get, post } from "@/app/lib/fetchInterceptor";

export async function POST(request: Request) {
  const url = request.url;

  try {
    const body = await request.json();

    switch (true) {
      case url.includes("/send"):
        const sendData = await post(`/notification/send`, body);
        return NextResponse.json(sendData);

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

  try {
    switch (true) {
      case url.includes("/subscribe"):
        const subscribeData = await get(`/notification/subscribe`);
        return NextResponse.json(subscribeData);

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
  if (url.includes("/send")) return "Failed to send notification";
  if (url.includes("/subscribe")) return "Failed to subscribe to notifications";
  return "An error occurred";
}
