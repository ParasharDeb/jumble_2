/*
  Warnings:

  - Added the required column `github` to the `Details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `Details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Details" ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT NOT NULL;
