-- CreateEnum
CREATE TYPE "Title" AS ENUM ('MR', 'MRS', 'MS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "title" "Title";
