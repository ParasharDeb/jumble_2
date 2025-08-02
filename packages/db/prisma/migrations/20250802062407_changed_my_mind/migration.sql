/*
  Warnings:

  - The primary key for the `UserJobs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Details" DROP CONSTRAINT "Details_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_HRId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Details" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."HR" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "HR_id_seq";

-- AlterTable
ALTER TABLE "public"."Jobs" ALTER COLUMN "HRId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserJobs_pkey" PRIMARY KEY ("userId", "jobId");

-- AddForeignKey
ALTER TABLE "public"."Details" ADD CONSTRAINT "Details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_HRId_fkey" FOREIGN KEY ("HRId") REFERENCES "public"."HR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserJobs" ADD CONSTRAINT "UserJobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
