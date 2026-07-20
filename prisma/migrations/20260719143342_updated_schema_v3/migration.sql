/*
  Warnings:

  - You are about to drop the column `isSystem` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `Question` table. All the data in the column will be lost.
  - The `languages` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `solutionCode` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('javascript', 'typescript', 'python', 'go', 'java', 'cpp', 'c', 'csharp', 'ruby', 'rust', 'php');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Pending', 'Running', 'Accepted', 'Wrong_Answer', 'Runtime_Error', 'Time_Limit_Exceeded', 'Memory_Limit_Exceeded', 'Compilation_Error');

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "isSystem",
DROP COLUMN "testCases",
ADD COLUMN     "hint" JSONB,
ADD COLUMN     "spaceComplexity" TEXT,
ADD COLUMN     "timeComplexity" TEXT,
DROP COLUMN "languages",
ADD COLUMN     "languages" "Language"[],
DROP COLUMN "solutionCode",
ADD COLUMN     "solutionCode" JSONB;

-- CreateTable
CREATE TABLE "QuestionTestCase" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionSubmission" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "applicantId" TEXT,
    "interviewId" TEXT,
    "language" "Language" NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtime" DOUBLE PRECISION,
    "memory" DOUBLE PRECISION,
    "score" DOUBLE PRECISION,
    "passedTestCases" INTEGER NOT NULL DEFAULT 0,
    "totalTestCases" INTEGER NOT NULL DEFAULT 0,
    "testCaseResults" JSONB,
    "compilerOutput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "score" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionTestCase_questionId_idx" ON "QuestionTestCase"("questionId");

-- CreateIndex
CREATE INDEX "QuestionTestCase_isHidden_idx" ON "QuestionTestCase"("isHidden");

-- CreateIndex
CREATE INDEX "QuestionSubmission_questionId_idx" ON "QuestionSubmission"("questionId");

-- CreateIndex
CREATE INDEX "QuestionSubmission_applicantId_idx" ON "QuestionSubmission"("applicantId");

-- CreateIndex
CREATE INDEX "QuestionSubmission_interviewId_idx" ON "QuestionSubmission"("interviewId");

-- CreateIndex
CREATE INDEX "QuestionSubmission_status_idx" ON "QuestionSubmission"("status");

-- CreateIndex
CREATE INDEX "InterviewQuestion_questionId_idx" ON "InterviewQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewQuestion_interviewId_questionId_key" ON "InterviewQuestion"("interviewId", "questionId");

-- AddForeignKey
ALTER TABLE "QuestionTestCase" ADD CONSTRAINT "QuestionTestCase_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
