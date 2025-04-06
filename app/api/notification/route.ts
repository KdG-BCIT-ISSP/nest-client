import { NextResponse } from "next/server";
import { get, post } from "@/app/lib/fetchInterceptor";

export async function POST(request: Request) {
  const url = request.url;

  try {
    const body = await request.json();

    switch (true) {
      case url.includes("/announcement/send"):
        // Request Body: { message: string, announcement: true }
        const announcementData = await post(`/notification/announcement/send`, {
          message: body.message,
          announcement: true
        });
        return NextResponse.json(announcementData);

      case url.includes("/send"):
        // Request Body: { memberId: string, message: string }
        const sendData = await post(`/notification/send`, {
          memberId: body.memberId,
          message: body.message
        });
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
    const urlParams = new URL(url).searchParams;

    switch (true) {
      case url.includes("/notification") && !url.includes("/subscribe"):
        const queryParams = new URLSearchParams({
          page: urlParams.get("page") || "1",
          size: urlParams.get("size") || "10",
          sort: urlParams.get("sort") || "desc",
        }).toString();

        const notificationData = await get(`/notification?${queryParams}`);
        return NextResponse.json(notificationData);

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

// Updated helper function to get specific error messages
function getErrorMessage(url: string): string {
  if (url.includes("/announcement/send")) return "Failed to send announcement";
  if (url.includes("/send")) return "Failed to send notification";
  if (url.includes("/subscribe")) return "Failed to subscribe to notifications";
  if (url.includes("/notification")) return "Failed to fetch notifications";
  return "An error occurred";
}