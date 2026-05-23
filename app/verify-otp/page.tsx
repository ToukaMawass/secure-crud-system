"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("pendingUsername");

    if (!savedUsername) {
      router.push("/login");
      return;
    }

    setUsername(savedUsername);
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed.");
        return;
      }

      localStorage.removeItem("pendingUsername");

      setMessage("OTP verified successfully.");

      router.push("/products");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            Two-Factor Authentication
          </p>

          <h1 className="text-3xl font-bold">Verify OTP</h1>

          <p className="mt-3 text-sm text-slate-400">
            Enter the 6-digit code sent to your email.
          </p>

          {username && (
            <p className="mt-3 text-xs text-slate-500">
              Verifying account: <span className="text-cyan-400">{username}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium">
              OTP Code
            </label>

            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Example: 123456"
              maxLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xl tracking-[0.35em] text-white outline-none focus:border-cyan-400"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300 border border-slate-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </section>
    </main>
  );
}