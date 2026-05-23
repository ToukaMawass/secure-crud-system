import { NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/users";
import { generateOtp, saveOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const body = await request.json();

const { username, password, turnstileToken } = body;
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    const user = findUserByUsername(username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid username or password." },
        { status: 401 }
      );
    }
    if (!turnstileToken) {
  return NextResponse.json(
    { message: "Human verification is required." },
    { status: 400 }
  );
}

const isHuman = await verifyTurnstileToken(turnstileToken);

if (!isHuman) {
  return NextResponse.json(
    { message: "Human verification failed." },
    { status: 400 }
  );
}

    const otp = generateOtp();

    saveOtp(user.username, otp);

await sendOtpEmail(otp);
    return NextResponse.json({
      message: "OTP sent to your email.",
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong during login." },
      { status: 500 }
    );
  }
}