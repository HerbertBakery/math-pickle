import bcrypt from "bcryptjs";
import {
  AssignmentStatus,
  ClassroomMembershipRole,
  Prisma,
  PrismaClient,
  PuzzleScoreDirection,
  PuzzleType,
  UserRole
} from "@prisma/client";

const prisma = new PrismaClient();

function makeTargetArray(last: number) {
  return Array.from({ length: last }, (_, i) => i + 1);
}

async function upsertVariant(args: {
  puzzleId: string;
  slug: string;
  title: string;
  description: string;
  scoreDirection: PuzzleScoreDirection;
  primaryMetricLabel: string;
  secondaryMetricLabel: string;
  configJson: Record<string, unknown>;
}) {
  return prisma.puzzleVariant.upsert({
    where: {
      puzzleId_slug: {
        puzzleId: args.puzzleId,
        slug: args.slug
      }
    },
    update: {
      title: args.title,
      description: args.description,
      isOfficial: true,
      leaderboardEnabled: true,
      scoreDirection: args.scoreDirection,
      primaryMetricLabel: args.primaryMetricLabel,
      secondaryMetricLabel: args.secondaryMetricLabel,
      configJson: args.configJson as Prisma.InputJsonValue
    },
    create: {
      puzzleId: args.puzzleId,
      slug: args.slug,
      title: args.title,
      description: args.description,
      isOfficial: true,
      leaderboardEnabled: true,
      scoreDirection: args.scoreDirection,
      primaryMetricLabel: args.primaryMetricLabel,
      secondaryMetricLabel: args.secondaryMetricLabel,
      configJson: args.configJson as Prisma.InputJsonValue
    }
  });
}

async function main() {
  const teacherPasswordHash = await bcrypt.hash("teacher123", 10);
  const studentPasswordHash = await bcrypt.hash("student123", 10);

  const school = await prisma.school.upsert({
    where: {
      slug: "mathpickle"
    },
    update: {
      name: "MathPickle",
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax"
    },
    create: {
      name: "MathPickle",
      slug: "mathpickle",
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax"
    }
  });

  const teacher = await prisma.user.upsert({
    where: { email: "gordon@mathpickle.com" },
    update: {
      firstName: "Gordon",
      lastName: "Hamilton",
      displayName: "Gordon Hamilton",
      role: UserRole.TEACHER,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax",
      schoolId: school.id
    },
    create: {
      email: "gordon@mathpickle.com",
      passwordHash: teacherPasswordHash,
      firstName: "Gordon",
      lastName: "Hamilton",
      displayName: "Gordon Hamilton",
      role: UserRole.TEACHER,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax",
      schoolId: school.id
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {
      firstName: "Ava",
      lastName: "Student",
      displayName: "Ava Student",
      role: UserRole.STUDENT,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax",
      schoolId: school.id
    },
    create: {
      email: "student@example.com",
      passwordHash: studentPasswordHash,
      firstName: "Ava",
      lastName: "Student",
      displayName: "Ava Student",
      role: UserRole.STUDENT,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax",
      schoolId: school.id
    }
  });

  const classroom = await prisma.classroom.upsert({
    where: { slug: "grade-5-problem-solvers" },
    update: {
      name: "Grade 5 Problem Solvers",
      joinCode: "MPK9814A",
      gradeLabel: "Grade 5",
      subjectLabel: "Problem Solving",
      teacherId: teacher.id,
      schoolId: school.id,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax"
    },
    create: {
      name: "Grade 5 Problem Solvers",
      slug: "grade-5-problem-solvers",
      joinCode: "MPK9814A",
      gradeLabel: "Grade 5",
      subjectLabel: "Problem Solving",
      teacherId: teacher.id,
      schoolId: school.id,
      countryCode: "CA",
      stateProvince: "Nova Scotia",
      city: "Halifax"
    }
  });

  await prisma.classroomMembership.upsert({
    where: {
      classroomId_userId: {
        classroomId: classroom.id,
        userId: student.id
      }
    },
    update: {
      role: ClassroomMembershipRole.STUDENT
    },
    create: {
      classroomId: classroom.id,
      userId: student.id,
      role: ClassroomMembershipRole.STUDENT
    }
  });

  const lazyArchitect = await prisma.puzzle.upsert({
    where: { slug: "lazy-architect" },
    update: {
      title: "Lazy Architect",
      summary: "Build rooms in order and use as few walls as possible.",
      gradeBand: "3-8",
      subject: "Spatial reasoning / optimization",
      type: PuzzleType.INTERACTIVE,
      featured: true,
      estimatedMins: 20
    },
    create: {
      title: "Lazy Architect",
      slug: "lazy-architect",
      summary: "Build rooms in order and use as few walls as possible.",
      gradeBand: "3-8",
      subject: "Spatial reasoning / optimization",
      type: PuzzleType.INTERACTIVE,
      featured: true,
      estimatedMins: 20
    }
  });

  const animalSubtraction = await prisma.puzzle.upsert({
    where: { slug: "animal-subtraction" },
    update: {
      title: "Animal Subtraction",
      summary: "A visual subtraction puzzle using animal groupings and image-based reasoning.",
      gradeBand: "2-6",
      subject: "Subtraction / visual reasoning",
      type: PuzzleType.INTERACTIVE,
      featured: true,
      estimatedMins: 15
    },
    create: {
      title: "Animal Subtraction",
      slug: "animal-subtraction",
      summary: "A visual subtraction puzzle using animal groupings and image-based reasoning.",
      gradeBand: "2-6",
      subject: "Subtraction / visual reasoning",
      type: PuzzleType.INTERACTIVE,
      featured: true,
      estimatedMins: 15
    }
  });

  const zebraMultiplication = await prisma.puzzle.upsert({
    where: { slug: "zebra-multiplication" },
    update: {
      title: "Zebra Multiplication",
      summary: "A multiplication strategy game built around grouping, patterning, and score-based play.",
      gradeBand: "3-7",
      subject: "Multiplication / number sense",
      type: PuzzleType.GAME,
      featured: true,
      estimatedMins: 20
    },
    create: {
      title: "Zebra Multiplication",
      slug: "zebra-multiplication",
      summary: "A multiplication strategy game built around grouping, patterning, and score-based play.",
      gradeBand: "3-7",
      subject: "Multiplication / number sense",
      type: PuzzleType.GAME,
      featured: true,
      estimatedMins: 20
    }
  });

  const lazySequentialVariant = await upsertVariant({
    puzzleId: lazyArchitect.id,
    slug: "sequential",
    title: "Sequential",
    description: "Build rooms in order. Fewer walls is better.",
    scoreDirection: PuzzleScoreDirection.LOWER_BETTER,
    primaryMetricLabel: "Walls",
    secondaryMetricLabel: "Time",
    configJson: {
      mode: "sequential",
      metricType: "score"
    }
  });

  const lazyClassicVariants = [];
  for (let n = 4; n <= 10; n += 1) {
    const targets = makeTargetArray(n);
    const variant = await upsertVariant({
      puzzleId: lazyArchitect.id,
      slug: `classic-1-to-${n}`,
      title: `Classic 1 to ${n}`,
      description: `Classic target set from 1 through ${n}. Fewer walls is better.`,
      scoreDirection: PuzzleScoreDirection.LOWER_BETTER,
      primaryMetricLabel: "Walls",
      secondaryMetricLabel: "Time",
      configJson: {
        mode: "classic",
        targets,
        metricType: "score"
      }
    });
    lazyClassicVariants.push(variant);
  }

  const lazyEnergeticVariants = [];
  for (let n = 4; n <= 10; n += 1) {
    const targets = makeTargetArray(n);
    const variant = await upsertVariant({
      puzzleId: lazyArchitect.id,
      slug: `energetic-1-to-${n}`,
      title: `Energetic 1 to ${n}`,
      description: `Energetic mode from 1 through ${n}. More walls is better.`,
      scoreDirection: PuzzleScoreDirection.HIGHER_BETTER,
      primaryMetricLabel: "Walls",
      secondaryMetricLabel: "Time",
      configJson: {
        mode: "energetic",
        targets,
        metricType: "score"
      }
    });
    lazyEnergeticVariants.push(variant);
  }

  const animalBoards = [
    "Dragonfly",
    "Starfish",
    "Seagull",
    "Ant",
    "Spider",
    "Bird",
    "Snake",
    "Monkey",
    "Millipede",
    "Caterpillar",
    "Goat",
    "Shark",
    "Elephant",
    "Bee",
    "Hummingbird",
    "Butterfly"
  ];

  const animalVariants = [];
  for (const boardName of animalBoards) {
    const slug = boardName.toLowerCase().replace(/\s+/g, "-");
    const variant = await upsertVariant({
      puzzleId: animalSubtraction.id,
      slug,
      title: boardName,
      description: `${boardName} board. Faster time is better.`,
      scoreDirection: PuzzleScoreDirection.LOWER_BETTER,
      primaryMetricLabel: "Time",
      secondaryMetricLabel: "Attempts",
      configJson: {
        board: boardName,
        metricType: "time"
      }
    });
    animalVariants.push(variant);
  }

  const zebraBoards = [
    { id: "path", title: "Path" },
    { id: "crescent", title: "Crescent" },
    { id: "triangle", title: "Triangle" },
    { id: "harbor", title: "Harbor" },
    { id: "trapezoid", title: "Trapezoid" },
    { id: "vault", title: "Vault" },
    { id: "moonBloom", title: "Moon Bloom" },
    { id: "hourglass", title: "Hourglass" },
    { id: "arch", title: "Arch" },
    { id: "butterfly", title: "Butterfly" },
    { id: "doubleBridge", title: "Double Bridge" },
    { id: "ring", title: "Ring" },
    { id: "diamond", title: "Diamond" }
  ];

  const zebraVariants = [];
  for (const board of zebraBoards) {
    const variant = await upsertVariant({
      puzzleId: zebraMultiplication.id,
      slug: board.id,
      title: board.title,
      description: `${board.title} board. Higher score is better.`,
      scoreDirection: PuzzleScoreDirection.HIGHER_BETTER,
      primaryMetricLabel: "Score",
      secondaryMetricLabel: "Time",
      configJson: {
        boardId: board.id,
        metricType: "score"
      }
    });
    zebraVariants.push(variant);
  }

  await prisma.classroomAssignment.upsert({
    where: {
      id: "seed-assignment-lazy-architect"
    },
    update: {
      classroomId: classroom.id,
      puzzleId: lazyArchitect.id,
      puzzleVariantId: lazySequentialVariant.id,
      createdById: teacher.id,
      instructions: "Try to build the room sequence as efficiently as possible.",
      status: AssignmentStatus.PUBLISHED
    },
    create: {
      id: "seed-assignment-lazy-architect",
      classroomId: classroom.id,
      puzzleId: lazyArchitect.id,
      puzzleVariantId: lazySequentialVariant.id,
      createdById: teacher.id,
      instructions: "Try to build the room sequence as efficiently as possible.",
      status: AssignmentStatus.PUBLISHED
    }
  });

  await prisma.classroomAssignment.upsert({
    where: {
      id: "seed-assignment-animal-subtraction"
    },
    update: {
      classroomId: classroom.id,
      puzzleId: animalSubtraction.id,
      puzzleVariantId: animalVariants[0].id,
      createdById: teacher.id,
      instructions: "Work through the animal relationships carefully and explain your thinking.",
      status: AssignmentStatus.DRAFT
    },
    create: {
      id: "seed-assignment-animal-subtraction",
      classroomId: classroom.id,
      puzzleId: animalSubtraction.id,
      puzzleVariantId: animalVariants[0].id,
      createdById: teacher.id,
      instructions: "Work through the animal relationships carefully and explain your thinking.",
      status: AssignmentStatus.DRAFT
    }
  });

  await prisma.classroomAssignment.upsert({
    where: {
      id: "seed-assignment-zebra-multiplication"
    },
    update: {
      classroomId: classroom.id,
      puzzleId: zebraMultiplication.id,
      puzzleVariantId: zebraVariants.find((variant) => variant.slug === "trapezoid")?.id ?? zebraVariants[0].id,
      createdById: teacher.id,
      instructions: "Play a round and look for strong multiplication strategies.",
      status: AssignmentStatus.DRAFT
    },
    create: {
      id: "seed-assignment-zebra-multiplication",
      classroomId: classroom.id,
      puzzleId: zebraMultiplication.id,
      puzzleVariantId: zebraVariants.find((variant) => variant.slug === "trapezoid")?.id ?? zebraVariants[0].id,
      createdById: teacher.id,
      instructions: "Play a round and look for strong multiplication strategies.",
      status: AssignmentStatus.DRAFT
    }
  });

  console.log("Seed complete.");
  console.log("Teacher login: gordon@mathpickle.com / teacher123");
  console.log("Student login: student@example.com / student123");
  console.log("Created Lazy Architect, Animal Subtraction, and Zebra Multiplication variants.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });