/*
  Warnings:

  - The `userId` column on the `Details` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id` column on the `HR` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserJobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `HRId` on the `Jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserJobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Details" DROP CONSTRAINT "Details_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_HRId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Details" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."HR" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "public"."Jobs" DROP COLUMN "HRId",
ADD COLUMN     "HRId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserJobs" DROP CONSTRAINT "UserJobs_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "UserJobs_pkey" PRIMARY KEY ("userId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Details_userId_key" ON "public"."Details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HR_id_key" ON "public"."HR"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- AddForeignKey
ALTER TABLE "public"."Details" ADD CONSTRAINT "Details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_HRId_fkey" FOREIGN KEY ("HRId") REFERENCES "public"."HR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserJobs" ADD CONSTRAINT "UserJobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
