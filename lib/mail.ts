import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(otp: string) {
  const receiverEmail = process.env.OTP_RECEIVER_EMAIL;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  if (!receiverEmail) {
    throw new Error("OTP_RECEIVER_EMAIL is missing.");
  }

  const { data, error } = await resend.emails.send({
    from: "Secure CRUD System <onboarding@resend.dev>",
    to: receiverEmail,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Secure CRUD System</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email.");
  }

  return data;
}