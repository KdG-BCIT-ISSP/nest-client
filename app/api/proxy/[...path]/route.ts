import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function proxyRequest(request: Request, params: { path: string[] }) {
  const { path } = params;
  const targetUrl = new URL(`${API_BASE_URL}/${path.join("/")}`);

  const reqUrl = new URL(request.url);
  reqUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl.toString(), init);

  if (response.headers.get("Content-Type")?.includes("text/event-stream")) {
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const data = await response.text();
  const headers = new Headers(response.headers);
  headers.set("Content-Length", Buffer.byteLength(data).toString());
  headers.delete("content-encoding");

  return new NextResponse(data, {
    status: response.status,
    headers: headers,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params);
}

export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params);
}

export async function PUT(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params);
}

export async function DELETE(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params);
}
