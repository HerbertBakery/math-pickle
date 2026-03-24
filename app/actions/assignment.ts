"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createAssignmentAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const classroomId = String(formData.get("classroomId") || "").trim();
  const puzzleVariantId = String(formData.get("puzzleVariantId") || "").trim();
  const instructions = String(formData.get("instructions") || "").trim();
  const titleOverride = String(formData.get("titleOverride") || "").trim();
  const statusRaw = String(formData.get("status") || "DRAFT").trim().toUpperCase();

  if (!classroomId || !puzzleVariantId) {
    redirect("/dashboard/teacher?error=Missing%20classroom%20or%20variant");
  }

  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId: session.user.id
    }
  });

  if (!classroom) {
    redirect("/dashboard/teacher?error=Classroom%20not%20found");
  }

  const puzzleVariant = await prisma.puzzleVariant.findUnique({
    where: {
      id: puzzleVariantId
    },
    include: {
      puzzle: true
    }
  });

  if (!puzzleVariant) {
    redirect(`/dashboard/teacher/classes/${classroomId}/assign?error=Variant%20not%20found`);
  }

  const validStatus = statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  await prisma.classroomAssignment.create({
    data: {
      classroomId,
      puzzleId: puzzleVariant.puzzleId,
      puzzleVariantId: puzzleVariant.id,
      createdById: session.user.id,
      titleOverride: titleOverride || null,
      instructions: instructions || null,
      status: validStatus
    }
  });

  redirect(`/dashboard/teacher/classes/${classroomId}`);
}