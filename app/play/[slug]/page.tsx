import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Clock3, GraduationCap, School, Tag, Users } from "lucide-react";
import { auth } from "@/auth";
import { PuzzlePlayerFrame } from "@/components/puzzles/puzzle-player-frame";
import { prisma } from "@/lib/prisma";
import { getPuzzleDelivery } from "@/lib/puzzle-registry";

function prettyType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function PuzzlePlayPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: {
    classroomId?: string;
    assignmentId?: string;
    variant?: string;
  };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const puzzle = await prisma.puzzle.findUnique({
    where: {
      slug: params.slug
    }
  });

  if (!puzzle) {
    notFound();
  }

  const delivery = getPuzzleDelivery(puzzle.slug);

  if (!delivery) {
    notFound();
  }

  let assignmentContext: {
    id: string;
    title: string;
    instructions: string | null;
    classroomId: string;
    classroomName: string;
    puzzleVariantSlug: string | null;
    puzzleVariantTitle: string | null;
  } | null = null;

  const classroomId = searchParams?.classroomId?.trim();
  const assignmentId = searchParams?.assignmentId?.trim();
  const variantSlugFromUrl = searchParams?.variant?.trim() || null;

  if (classroomId && assignmentId) {
    const assignment = await prisma.classroomAssignment.findFirst({
      where: {
        id: assignmentId,
        classroomId,
        puzzleId: puzzle.id
      },
      include: {
        classroom: true,
        puzzleVariant: true
      }
    });

    if (assignment) {
      if (session.user.role === "STUDENT") {
        const membership = await prisma.classroomMembership.findFirst({
          where: {
            classroomId: assignment.classroomId,
            userId: session.user.id
          }
        });

        if (!membership) {
          redirect("/dashboard/student");
        }
      }

      if (session.user.role === "TEACHER") {
        const ownsClassroom = await prisma.classroom.findFirst({
          where: {
            id: assignment.classroomId,
            teacherId: session.user.id
          }
        });

        if (!ownsClassroom) {
          redirect("/dashboard/teacher");
        }
      }

      assignmentContext = {
        id: assignment.id,
        title: assignment.titleOverride || puzzle.title,
        instructions: assignment.instructions,
        classroomId: assignment.classroomId,
        classroomName: assignment.classroom.name,
        puzzleVariantSlug: assignment.puzzleVariant?.slug || null,
        puzzleVariantTitle: assignment.puzzleVariant?.title || null
      };
    }
  }

  const directVariant =
    !assignmentContext && variantSlugFromUrl
      ? await prisma.puzzleVariant.findUnique({
          where: {
            puzzleId_slug: {
              puzzleId: puzzle.id,
              slug: variantSlugFromUrl
            }
          }
        })
      : null;

  const effectiveVariantSlug = assignmentContext?.puzzleVariantSlug ?? directVariant?.slug ?? null;
  const effectiveVariantTitle = assignmentContext?.puzzleVariantTitle ?? directVariant?.title ?? null;

  const backHref =
    assignmentContext && session.user.role === "STUDENT"
      ? "/dashboard/student"
      : assignmentContext && (session.user.role === "TEACHER" || session.user.role === "ADMIN")
        ? `/dashboard/teacher/classes/${assignmentContext.classroomId}`
        : `/puzzles/${puzzle.slug}`;

  const backLabel =
    assignmentContext && session.user.role === "STUDENT"
      ? "Back to student dashboard"
      : assignmentContext && (session.user.role === "TEACHER" || session.user.role === "ADMIN")
        ? "Back to classroom"
        : "Back to puzzle page";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-pickle-800 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {assignmentContext?.title || puzzle.title}
          </h1>

          <p className="mt-2 max-w-3xl text-muted">{puzzle.summary}</p>
        </div>

        <div className="rounded-[1.25rem] border border-line bg-white px-5 py-4 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pickle-700">
            Puzzle info
          </div>

          <div className="mt-3 grid gap-2 text-sm text-ink">
            <div>{prettyType(puzzle.type)}</div>

            {puzzle.gradeBand ? (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-pickle-700" />
                {puzzle.gradeBand}
              </div>
            ) : null}

            {puzzle.subject ? (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-pickle-700" />
                {puzzle.subject}
              </div>
            ) : null}

            {puzzle.estimatedMins ? (
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-pickle-700" />
                {puzzle.estimatedMins} min
              </div>
            ) : null}

            {effectiveVariantTitle ? (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-pickle-700" />
                {effectiveVariantTitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {assignmentContext ? (
        <section className="mb-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
                Assignment context
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-sm text-ink">
                <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
                  <School className="h-4 w-4 text-pickle-700" />
                  {assignmentContext.classroomName}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
                  <BookOpen className="h-4 w-4 text-pickle-700" />
                  {assignmentContext.puzzleVariantTitle || "Assigned activity"}
                </div>

                {session.user.role === "STUDENT" ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
                    <Users className="h-4 w-4 text-pickle-700" />
                    Student launch
                  </div>
                ) : null}
              </div>

              {assignmentContext.instructions ? (
                <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
                  {assignmentContext.instructions}
                </p>
              ) : (
                <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
                  This puzzle was opened through a classroom assignment.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <PuzzlePlayerFrame
        title={assignmentContext?.title || puzzle.title}
        src={delivery.publicPath}
        puzzleSlug={puzzle.slug}
        puzzleVariantSlug={effectiveVariantSlug}
        classroomId={assignmentContext?.classroomId ?? null}
        assignmentId={assignmentContext?.id ?? null}
      />

      <section className="mt-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Platform note
        </div>
        <p className="mt-3 max-w-4xl leading-7 text-muted">
          This puzzle is being delivered through the standalone player system with variant-aware saving for leaderboard and analytics support.
        </p>
      </section>
    </main>
  );
}