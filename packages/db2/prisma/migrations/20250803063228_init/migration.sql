-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Details" (
    "id" SERIAL NOT NULL,
    "resume" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "portfolio" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "deployed" TEXT,
    "description" TEXT NOT NULL,
    "landingPage" TEXT,
    "detailsId" INTEGER NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tech_stack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "detailsId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Tech_stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HR" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "HR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Jobs" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" INTEGER,
    "experience" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "company_logo" TEXT,
    "HRId" TEXT NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserJobs" (
    "userId" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserJobs_pkey" PRIMARY KEY ("userId","jobId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Details_userId_key" ON "public"."Details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_github_key" ON "public"."Projects"("github");

-- CreateIndex
CREATE UNIQUE INDEX "HR_email_key" ON "public"."HR"("email");

-- AddForeignKey
ALTER TABLE "public"."Details" ADD CONSTRAINT "Details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "public"."Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tech_stack" ADD CONSTRAINT "Tech_stack_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "public"."Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tech_stack" ADD CONSTRAINT "Tech_stack_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_HRId_fkey" FOREIGN KEY ("HRId") REFERENCES "public"."HR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserJobs" ADD CONSTRAINT "UserJobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserJobs" ADD CONSTRAINT "UserJobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
