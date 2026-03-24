"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

const teacherSignupSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().optional(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  schoolName: z.string().min(1).trim(),
  countryCode: z.string().min(2).max(3).trim().toUpperCase(),
  stateProvince: z.string().min(1).trim(),
  city: z.string().min(1).trim()
});

const studentSignupSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().optional(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  joinCode: z.string().min(4).trim().toUpperCase()
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createUniqueSchoolSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let counter = 2;

  while (await prisma.school.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/login?error=Please%20enter%20a%20valid%20email%20and%20password");
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    });

    const redirectTo =
      user?.role === UserRole.TEACHER
        ? "/dashboard/teacher"
        : user?.role === UserRole.ADMIN
          ? "/dashboard/teacher"
          : "/dashboard/student";

    await signIn("credentials", {
      email,
      password,
      redirectTo
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Invalid%20email%20or%20password");
    }
    throw error;
  }
}

export async function teacherSignupAction(formData: FormData) {
  const parsed = teacherSignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    schoolName: formData.get("schoolName"),
    countryCode: formData.get("countryCode"),
    stateProvince: formData.get("stateProvince"),
    city: formData.get("city")
  });

  if (!parsed.success) {
    redirect("/teacher-signup?error=Please%20complete%20all%20fields");
  }

  const {
    firstName,
    lastName,
    email,
    password,
    schoolName,
    countryCode,
    stateProvince,
    city
  } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    redirect("/teacher-signup?error=That%20email%20is%20already%20in%20use");
  }

  let school = await prisma.school.findFirst({
    where: {
      name: schoolName,
      countryCode,
      stateProvince,
      city
    }
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: schoolName,
        slug: await createUniqueSchoolSlug(schoolName),
        countryCode,
        stateProvince,
        city
      }
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      displayName: `${firstName}${lastName ? ` ${lastName}` : ""}`,
      email,
      passwordHash,
      role: UserRole.TEACHER,
      countryCode,
      stateProvince,
      city,
      schoolId: school.id
    }
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/teacher"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Account%20created.%20Please%20log%20in");
    }
    throw error;
  }
}

export async function studentSignupAction(formData: FormData) {
  const parsed = studentSignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    joinCode: formData.get("joinCode")
  });

  if (!parsed.success) {
    redirect("/student-signup?error=Please%20complete%20all%20fields");
  }

  const { firstName, lastName, email, password, joinCode } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    redirect("/student-signup?error=That%20email%20is%20already%20in%20use");
  }

  const classroom = await prisma.classroom.findUnique({
    where: { joinCode },
    include: {
      school: true
    }
  });

  if (!classroom) {
    redirect("/student-signup?error=That%20class%20code%20was%20not%20found");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const student = await prisma.user.create({
    data: {
      firstName,
      lastName,
      displayName: `${firstName}${lastName ? ` ${lastName}` : ""}`,
      email,
      passwordHash,
      role: UserRole.STUDENT,
      countryCode: classroom.countryCode ?? classroom.school?.countryCode ?? null,
      stateProvince: classroom.stateProvince ?? classroom.school?.stateProvince ?? null,
      city: classroom.city ?? classroom.school?.city ?? null,
      schoolId: classroom.schoolId
    }
  });

  await prisma.classroomMembership.create({
    data: {
      classroomId: classroom.id,
      userId: student.id
    }
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/student"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Account%20created.%20Please%20log%20in");
    }
    throw error;
  }
}