import Link from "next/link";
import { studentSignupAction } from "@/app/actions/auth";

export default function StudentSignupPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Student signup
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Join your class with a code</h1>
        <p className="mt-3 text-muted">
          Create a student account, join your classroom, and start working through assigned puzzles.
        </p>

        {searchParams?.error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <form action={studentSignupAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-ink">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-ink">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="student@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="joinCode" className="mb-2 block text-sm font-medium text-ink">
              Class join code
            </label>
            <input
              id="joinCode"
              name="joinCode"
              required
              className="w-full rounded-xl border border-line px-4 py-3 uppercase outline-none transition focus:border-pickle-400"
              placeholder="ABCD1234"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Create student account
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-pickle-800 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}