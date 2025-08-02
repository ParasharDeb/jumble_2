# Jumble

**Jumble** is a modern job matching platform inspired by the swipe interface of dating apps like Bumble, but designed exclusively for job seekers and recruiters. Users swipe right to apply for jobs and swipe left to skip. HRs can review all applicants, then swipe right to shortlist or left to reject candidates.

## Features

- **User Authentication:**  
  Secure sign-up/sign-in using JWT tokens, hashed passwords with bcrypt.

- **Profile Management:**  
  Users can update their details, add professional info, upload resumes (files stored on Cloudinary).

- **Swipe to Apply:**  
  Browse job postings; swipe right (`apply`) or left (`skip`). Applied jobs are tracked in your profile.

- **HR Dashboard:**  
  HRs view applicants for each job, then left/right swipe to shortlist or reject.

- **Tech Stack:**
  - Backend: Express.js, Node.js, Prisma ORM, PostgreSQL
  - Frontend: Next.js with TypeScript
  - Auth: JWT, bcrypt
  - File Uploads: Multer, Cloudinary
  - Monorepo management: Turborepo
  - TypeScript throughout for type safety

## Project Structure

/apps
/backend # Express.js API
/frontend # Next.js frontend

/packages
/db # Shared Prisma models and database logic

*Managed with Turborepo for workspaces.*

## Database Schema (Prisma Example)

Highlights (see full schema in `/packages/db/prisma/schema.prisma`):

- **User**: Signups, personal details, resume (`Details` relation), applied jobs (`UserJobs` join table).
- **Details**: Resume, portfolio, social links, etc.
- **Jobs**: Posted by HR, linked to multiple users via `UserJobs`.
- **HR**: Company-side users, manage job postings and swipe on applicants.
- **UserJobs**: Many-to-many relation, stores applications and swipe status (can be extended for swipe logic).

## Key Endpoints

- `POST /signup` & `POST /signin`: User auth
- `GET /jobs`: Browse available jobs
- `POST /apply`: Apply (right swipe) for a job
- `GET /appliedjobs`: View all applied jobs
- `POST /upload_resume`: Secure resume uploads (Multer + Cloudinary)
- `GET /applicants/:jobId` (HR): View candidates for a job
- `POST /hr/swipe`: HR swipes right/left on candidates

## Setup & Installation

### Prerequisites
- Node.js ≥ 18.x
- pnpm (or npm/yarn, pnpm recommended with Turborepo)
- PostgreSQL database
- Cloudinary account for file uploads

### 1. Clone & Install


git clone https://github.com/your-org/jumble.git
cd jumble
pnpm install


### 2. Environment Variables

Create `.env` files in `/apps/backend` and `/packages/db` with the following variables:

DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret


### 3. Migrate Database

pnpm turbo run db:migrate

OR
cd packages/db && npx prisma migrate dev


### 4. Run Apps

- **Backend:**  
cd apps/backend
pnpm dev


## How It Works

### For Job Seekers

1. Sign up & log in.
2. Complete your profile & upload your resume.
3. Browse jobs, swipe right to apply, left to skip.
4. Track all applications.

### For HRs

1. Sign up as HR.
2. Post new jobs.
3. View all applicants for each job.
4. Swipe right (shortlist) or left (reject) on each candidate.

## Security

- All sensitive credentials stored in environment variables.
- Passwords hashed with bcrypt.
- JWT tokens for session/authentication.
- Multer restricts file uploads to resume files (configurable).

## Contributing

- Fork the repo, create a branch, and submit pull requests.
- Prisma schema located in `/packages/db/prisma`.
- Shared types and interfaces are managed across packages.
- Tests to be added based on your preferred framework.

## TODO

- Implement email verification and password reset.
- Add automated tests and CI/CD.
- Add candidate/job analytics dashboards.
