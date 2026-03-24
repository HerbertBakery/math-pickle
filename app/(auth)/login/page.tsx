import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Welcome back
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Log in to MathPickle</h1>
        <p className="mt-3 text-muted">
          Teachers manage classrooms. Students join class spaces and work through assigned puzzles.
        </p>

        {searchParams?.error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-pickle-400"
              placeholder="you@school.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-pickle-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 grid gap-3 text-sm text-muted">
          <Link href="/teacher-signup" className="font-medium text-pickle-800 hover:underline">
            Need a teacher account?
          </Link>
          <Link href="/student-signup" className="font-medium text-pickle-800 hover:underline">
            Need a student account?
          </Link>
        </div>
      </div>
    </main>
  );
}