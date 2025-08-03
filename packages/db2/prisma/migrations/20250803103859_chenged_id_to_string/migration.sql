/*
  Warnings:

  - The primary key for the `Jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserJobs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Tech_stack" DROP CONSTRAINT "Tech_stack_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_jobId_fkey";

-- AlterTable
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Jobs_id_seq";

-- AlterTable
ALTER TABLE "public"."Tech_stack" ALTER COLUMN "jobId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_pkey",
ALTER COLUMN "jobId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserJobs_pkey" PRIMARY KEY ("userId", "jobId");

-- AddForeignKey
ALTER TABLE "public"."Tech_stack" ADD CONSTRAINT "Tech_stack_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserJobs" ADD CONSTRAINT "UserJobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
