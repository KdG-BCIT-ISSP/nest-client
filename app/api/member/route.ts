import { NextResponse } from "next/server";
import { get, post, put } from "@/app/lib/fetchInterceptor";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Use switch-case to determine GET route based on the URL
  switch (true) {
    case pathname.endsWith("/all"): {
      // GET /api/member/all - Get all users
      try {
        const data = await get("/member/all");
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch users";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
    default: {
      // GET /api/member/me - Get current user profile
      try {
        const data = await get("/member/me");
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch profile";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  switch (true) {
    case pathname.endsWith("/login"): {
      // POST /api/member/login - User login
      try {
        const { email, password } = await request.json();
        if (!email || !password) {
          return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
          );
        }
        const data = await post("/member/login", { email, password });
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
    case pathname.endsWith("/join"): {
      // POST /api/member/join - Register new user
      try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
          return NextResponse.json(
            { message: "Username, email, and password are required" },
            { status: 400 }
          );
        }
        const data = await post("/member/join", { username, email, password });
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
    default:
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Use switch-case to differentiate profile update from role update
  switch (true) {
    case pathname.includes("/role/"): {
      // PUT /api/member/role/[id] - Update user role
      try {
        const segments = pathname.split("/");
        const idSegment = segments[segments.length - 1];
        const id = parseInt(idSegment);
        if (isNaN(id)) {
          return NextResponse.json(
            { message: "Invalid user ID" },
            { status: 400 }
          );
        }
        const { memberRole } = await request.json();
        if (!memberRole) {
          return NextResponse.json(
            { message: "Role is required" },
            { status: 400 }
          );
        }
        const data = await put(`/member/role/${id}`, { memberRole });
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Role update failed";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
    default: {
      // PUT /api/member/me - Update current user profile
      try {
        const { username, region, avatar } = await request.json();
        if (!username) {
          return NextResponse.json(
            { message: "Username is required" },
            { status: 400 }
          );
        }
        const data = await put("/member/me", { username, region, avatar });
        return NextResponse.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Profile update failed";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
  }
}
