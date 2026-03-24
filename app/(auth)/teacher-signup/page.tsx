import Link from "next/link";
import { GraduationCap, MapPin, School } from "lucide-react";
import { teacherSignupAction } from "@/app/actions/auth";

export default function TeacherSignupPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_.95fr] lg:items-start">
        <section className="rounded-[2rem] border border-line bg-gradient-to-b from-pickle-50 to-white p-8 shadow-soft">
          <div className="inline-flex items-center rounded-full border border-pickle-200 bg-white px-4 py-2 text-sm font-semibold text-pickle-800">
            Founding teacher signup
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Create your teacher account
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Set up your school profile properly from the start so classrooms, students, leaderboards, and regional rankings are organized cleanly.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <School className="h-5 w-5 text-pickle-700" />
                <div className="font-semibold text-ink">School-based setup</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Connect your account to a real school so your class results can roll up into school rankings.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-pickle-700" />
                <div className="font-semibold text-ink">Regional leaderboards</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Country, province or state, school, class, and global comparisons all depend on accurate location data.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-pickle-700" />
                <div className="font-semibold text-ink">Built for classroom analytics</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Track student progress, puzzle results, class performance, and long-term growth across the platform.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
            Teacher signup
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Set up your account
          </h2>
          <p className="mt-3 text-muted">
            This information will shape how your classes and leaderboards are organized.
          </p>

          {searchParams?.error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchParams.error}
            </div>
          ) : null}

          <form action={teacherSignupAction} className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-ink">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
                placeholder="Gordon"
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
                placeholder="Hamilton"
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
                placeholder="teacher@school.com"
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
                placeholder="At least 6 characters"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="schoolName" className="mb-2 block text-sm font-medium text-ink">
                School name
              </label>
              <input
                id="schoolName"
                name="schoolName"
                required
                className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
                placeholder="Harbour View Middle School"
              />
            </div>

            <div>
              <label htmlFor="countryCode" className="mb-2 block text-sm font-medium text-ink">
                Country code
              </label>
              <input
                id="countryCode"
                name="countryCode"
                required
                maxLength={3}
                className="w-full rounded-xl border border-line px-4 py-3 uppercase outline-none transition focus:border-pickle-400"
                placeholder="CA"
              />
            </div>

            <div>
              <label htmlFor="stateProvince" className="mb-2 block text-sm font-medium text-ink">
                Province or state
              </label>
              <input
                id="stateProvince"
                name="stateProvince"
                required
                className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
                placeholder="Nova Scotia"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-ink">
                City
              </label>
              <input
                id="city"
                name="city"
                required
                className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
                placeholder="Halifax"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Create teacher account
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-pickle-800 hover:underline">
              Log in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}