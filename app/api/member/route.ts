import { NextResponse } from "next/server";
import { get, post, put } from "@/app/lib/fetchInterceptor";

// GET /api/member/me - Get current user profile
export async function GET() {
  try {
    const data = await get("/member/me");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET /api/member/all - Get all users
export async function GET_ALL() {
  try {
    const data = await get("/member/all");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// POST /api/member/join - Register new user
export async function POST(request: Request) {
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

// POST /api/member/login - User login
export async function POST_LOGIN(request: Request) {
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

// PUT /api/member/me - Update current user profile
export async function PUT(request: Request) {
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

// PUT /api/member/role/[id] - Update user role
export async function PUT_ROLE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
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
