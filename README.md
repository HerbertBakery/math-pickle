# MathPickle Ecosystem Starter

A modern starter base for a rebuilt `mathpickle.com` using the familiar stack from your other builds: **Next.js + TypeScript + Tailwind + Prisma**.

## What is included

- Public landing page with a clean, modern MathPickle-style vibe
- Teacher signup page UI
- Student signup page UI with class code field
- Teacher dashboard starter
- Student dashboard starter
- Class workspace starter
- Prisma schema for:
  - users
  - teacher classrooms
  - student classroom joins
  - puzzles
  - classroom assignments
  - student progress
- Seed file with sample teacher, student, classroom, and puzzle data
- Auth scaffolding placeholder with Auth.js credentials provider

## Why this starter fits MathPickle

The current MathPickle site emphasizes:

- practical value for teachers
- puzzle and game discovery
- organization by grade and subject
- visually compelling problem solving
- a wide range of student engagement

This starter keeps that spirit, but reorganizes it into a more modern product structure with account systems and classroom infrastructure. Public descriptions of the current site highlight its teacher-first practical focus, grade/subject organization, and visually compelling puzzle design. citeturn400879search0turn400879search7turn400879search9

## Quick start

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`

## Important note

This is a **starter base**, not a finished production app yet.

The UI, routing, data model, and overall structure are in place. The main next implementation steps are:

1. wire signup/login forms to Auth.js
2. hash passwords properly with bcrypt or argon2
3. add server actions or API routes for classroom creation and class joining
4. build public browse pages for grade, subject, and puzzle detail pages
5. connect dashboards to real database queries
6. add media storage for puzzle thumbnails and printable files
7. add assignment and progress analytics

## Suggested next build phases

### Phase 1
- Real auth
- Real teacher create-class flow
- Real student join-by-code flow

### Phase 2
- Public puzzle library
- Grade filters
- Subject filters
- Featured collections

### Phase 3
- Interactive puzzle player pages
- Assignment tracking
- Teacher analytics

### Phase 4
- Premium or member-only collections
- Saved classrooms and curriculum bundles
- Printable resource uploads

## Suggested deploy flow

```bash
git init
git add .
git commit -m "Initial MathPickle ecosystem starter"
```

Then push to GitHub and connect to Vercel the same way as your other builds.
