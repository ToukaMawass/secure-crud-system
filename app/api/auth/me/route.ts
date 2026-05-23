import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 401 }
    );
  }
}