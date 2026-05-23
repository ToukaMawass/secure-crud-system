import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
          Web 1 Final Exam Project
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Secure CRUD System
        </h1>

        <p className="text-slate-300 text-lg mb-8">
          A Next.js application with API routes, JWT authentication, email OTP
          verification, Cloudflare human verification, role-based permissions,
          and a protected CRUD page.
        </p>

        <div className="flex justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition"
          >
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}