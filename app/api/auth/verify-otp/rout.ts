import { NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/users";
import { verifyOtp } from "@/lib/otp";
import { createToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, otp } = body;

    if (!username || !otp) {
      return NextResponse.json(
        { message: "Username and OTP are required." },
        { status: 400 }
      );
    }

    const user = findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const isOtpValid = verifyOtp(username, otp);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    const token = createToken({
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "OTP verified successfully.",
      user: {
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      { message: "Something went wrong during OTP verification." },
      { status: 500 }
    );
  }
}