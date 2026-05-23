"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "nextjs-turnstile";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!turnstileToken) {
      setMessage("Please complete the human verification first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("pendingUsername", data.username);

      setMessage("OTP sent to your email.");

      router.push("/verify-otp");
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
            Secure Access
          </p>

          <h1 className="text-3xl font-bold">Login</h1>

          <p className="mt-3 text-sm text-slate-400">
            Enter your username and password to start the authentication
            process.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Example: admin"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Example: admin123"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => {
                setTurnstileToken("");
                setMessage("Human verification failed. Please try again.");
              }}
              onExpire={() => {
                setTurnstileToken("");
                setMessage("Human verification expired. Please verify again.");
              }}
              theme="dark"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300 border border-slate-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !turnstileToken}
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending OTP...89" : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}