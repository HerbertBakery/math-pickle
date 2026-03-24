import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createClassroomAction } from "@/app/actions/classroom";

export default async function NewClassroomPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard/teacher" className="text-sm font-medium text-pickle-800 hover:underline">
          ← Back to dashboard
        </Link>
      </div>

      <div className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Create classroom
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Set up a new class</h1>
        <p className="mt-3 text-muted">
          Create a classroom and get a join code your students can use during signup.
        </p>

        {searchParams?.error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <form action={createClassroomAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
              Class name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="Grade 6A Math"
            />
          </div>

          <div>
            <label htmlFor="gradeLabel" className="mb-2 block text-sm font-medium text-ink">
              Grade
            </label>
            <input
              id="gradeLabel"
              name="gradeLabel"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="Grade 6"
            />
          </div>

          <div>
            <label htmlFor="subjectLabel" className="mb-2 block text-sm font-medium text-ink">
              Subject
            </label>
            <input
              id="subjectLabel"
              name="subjectLabel"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="Mathematics"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Create classroom
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}