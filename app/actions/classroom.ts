"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function generateJoinCode(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function createUniqueClassroomSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let counter = 2;

  while (await prisma.classroom.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function createUniqueJoinCode() {
  let joinCode = generateJoinCode();

  while (await prisma.classroom.findUnique({ where: { joinCode } })) {
    joinCode = generateJoinCode();
  }

  return joinCode;
}

export async function createClassroomAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const name = String(formData.get("name") || "").trim();
  const gradeLabel = String(formData.get("gradeLabel") || "").trim();
  const subjectLabel = String(formData.get("subjectLabel") || "").trim();

  if (!name) {
    redirect("/dashboard/teacher/classes/new?error=Class%20name%20is%20required");
  }

  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      schoolId: true,
      countryCode: true
    }
  });

  const classroom = await prisma.classroom.create({
    data: {
      name,
      slug: await createUniqueClassroomSlug(name),
      joinCode: await createUniqueJoinCode(),
      gradeLabel: gradeLabel || null,
      subjectLabel: subjectLabel || null,
      teacherId: session.user.id,
      schoolId: teacher?.schoolId ?? null,
      countryCode: teacher?.countryCode ?? null
    }
  });

  redirect(`/dashboard/teacher/classes/${classroom.id}`);
}