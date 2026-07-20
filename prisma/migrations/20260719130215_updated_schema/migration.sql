/*
  Warnings:

  - The values [Draft,Screening_In_Progress,Screening_Completed,Qualified] on the enum `ApplicantStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `livekitRoomName` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `formTemplateId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `interviewerIds` on the `JobRound` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionTier` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `FormTemplate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jobId,email]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `interviewerId` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Recommendation" AS ENUM ('Strong_Hire', 'Hire', 'No_Hire', 'Strong_No_Hire');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('Full_Time', 'Part_Time', 'Contract', 'Internship');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('Entry', 'Mid', 'Senior', 'Lead', 'Executive');

-- CreateEnum
CREATE TYPE "RemoteType" AS ENUM ('Onsite', 'Hybrid', 'Remote');

-- CreateEnum
CREATE TYPE "RoundCategory" AS ENUM ('Screening', 'Technical', 'Design', 'Behavioral', 'Management');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('Coding', 'System_Design', 'System_Architecture', 'Behavioral', 'Technical_Theory', 'Business_Case');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('System', 'Application_Update', 'Interview_Scheduled', 'Screening_Completed', 'Employee_Invite');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicantStatus_new" AS ENUM ('Applied', 'Screening', 'Shortlisted', 'Interviewing', 'Offer', 'OfferAccepted', 'OfferRejected', 'Hired', 'Rejected', 'Withdrawn', 'OnHold');
ALTER TABLE "public"."Applicant" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Applicant" ALTER COLUMN "status" TYPE "ApplicantStatus_new" USING ("status"::text::"ApplicantStatus_new");
ALTER TYPE "ApplicantStatus" RENAME TO "ApplicantStatus_old";
ALTER TYPE "ApplicantStatus_new" RENAME TO "ApplicantStatus";
DROP TYPE "public"."ApplicantStatus_old";
ALTER TABLE "Applicant" ALTER COLUMN "status" SET DEFAULT 'Applied';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobBoardProvider" ADD VALUE 'MONSTER';
ALTER TYPE "JobBoardProvider" ADD VALUE 'GLASSDOOR';
ALTER TYPE "JobBoardProvider" ADD VALUE 'WELLFOUND';
ALTER TYPE "JobBoardProvider" ADD VALUE 'GREENHOUSE';
ALTER TYPE "JobBoardProvider" ADD VALUE 'LEVER';

-- DropForeignKey
ALTER TABLE "FormTemplate" DROP CONSTRAINT "FormTemplate_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_interviewerId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_formTemplateId_fkey";

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "countryPermit" BOOLEAN,
ADD COLUMN     "criminalRecord" BOOLEAN,
ADD COLUMN     "currentCompany" TEXT,
ADD COLUMN     "currentDesignation" TEXT,
ADD COLUMN     "currentRoundId" TEXT,
ADD COLUMN     "currentSalary" DOUBLE PRECISION,
ADD COLUMN     "expectedSalary" DOUBLE PRECISION,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "isExistingEmployee" BOOLEAN,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "noticePeriod" INTEGER,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "screeningScore" INTEGER,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "livekitRoomName",
DROP COLUMN "score",
ADD COLUMN     "communicationScore" INTEGER,
ADD COLUMN     "cultureScore" INTEGER,
ADD COLUMN     "livekitRoomId" TEXT,
ADD COLUMN     "overallScore" INTEGER,
ADD COLUMN     "problemSolvingScore" INTEGER,
ADD COLUMN     "recommendation" "Recommendation",
ADD COLUMN     "technicalScore" INTEGER,
ALTER COLUMN "interviewerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "formTemplateId",
ADD COLUMN     "closingDate" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "employmentType" "EmploymentType" NOT NULL DEFAULT 'Full_Time',
ADD COLUMN     "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'Mid',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "remoteType" "RemoteType" NOT NULL DEFAULT 'Onsite',
ADD COLUMN     "salaryMax" DOUBLE PRECISION,
ADD COLUMN     "salaryMin" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "JobBoardPost" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "JobRound" DROP COLUMN "interviewerIds",
ADD COLUMN     "category" "RoundCategory" NOT NULL DEFAULT 'Technical',
ADD COLUMN     "durationMinutes" INTEGER DEFAULT 45;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "subscriptionTier";

-- DropTable
DROP TABLE "FormTemplate";

-- CreateTable
CREATE TABLE "JobRoundInterviewer" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "JobRoundInterviewer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningResult" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "aiModel" TEXT,
    "resumeScore" INTEGER,
    "resumeFeedback" TEXT,
    "voiceScore" INTEGER,
    "voiceFeedback" TEXT,
    "voiceTranscript" TEXT,
    "codingScore" INTEGER,
    "codingFeedback" TEXT,
    "codingSourceTree" JSONB,
    "personalityScore" INTEGER,
    "overallScore" INTEGER,
    "recommendation" "Recommendation" DEFAULT 'Hire',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreeningResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSkill" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "JobSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantSkill" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "ApplicantSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "activeJobsLimit" INTEGER NOT NULL,
    "aiCreditsLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL DEFAULT 'Coding',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'Medium',
    "tags" TEXT[],
    "languages" TEXT[],
    "timeLimit" INTEGER,
    "memoryLimit" INTEGER,
    "testCases" JSONB,
    "starterCode" JSONB,
    "solutionCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL DEFAULT 'System',
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL DEFAULT 'Interviewer',
    "token" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRoundInterviewer_roundId_employeeId_key" ON "JobRoundInterviewer"("roundId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningResult_applicantId_key" ON "ScreeningResult"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "JobSkill_jobId_idx" ON "JobSkill"("jobId");

-- CreateIndex
CREATE INDEX "JobSkill_skillId_idx" ON "JobSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSkill_jobId_skillId_key" ON "JobSkill"("jobId", "skillId");

-- CreateIndex
CREATE INDEX "ApplicantSkill_applicantId_idx" ON "ApplicantSkill"("applicantId");

-- CreateIndex
CREATE INDEX "ApplicantSkill_skillId_idx" ON "ApplicantSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantSkill_applicantId_skillId_key" ON "ApplicantSkill"("applicantId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Question_organizationId_idx" ON "Question"("organizationId");

-- CreateIndex
CREATE INDEX "Question_category_idx" ON "Question"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Question_organizationId_title_key" ON "Question"("organizationId", "title");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeInvitation_token_key" ON "EmployeeInvitation"("token");

-- CreateIndex
CREATE INDEX "EmployeeInvitation_email_idx" ON "EmployeeInvitation"("email");

-- CreateIndex
CREATE INDEX "Applicant_jobId_idx" ON "Applicant"("jobId");

-- CreateIndex
CREATE INDEX "Applicant_status_idx" ON "Applicant"("status");

-- CreateIndex
CREATE INDEX "Applicant_currentRoundId_idx" ON "Applicant"("currentRoundId");

-- CreateIndex
CREATE INDEX "Applicant_email_idx" ON "Applicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_jobId_email_key" ON "Applicant"("jobId", "email");

-- CreateIndex
CREATE INDEX "Interview_interviewerId_idx" ON "Interview"("interviewerId");

-- CreateIndex
CREATE INDEX "Interview_startTime_idx" ON "Interview"("startTime");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "Interview"("status");

-- CreateIndex
CREATE INDEX "Job_organizationId_idx" ON "Job"("organizationId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- AddForeignKey
ALTER TABLE "JobRoundInterviewer" ADD CONSTRAINT "JobRoundInterviewer_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "JobRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRoundInterviewer" ADD CONSTRAINT "JobRoundInterviewer_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_currentRoundId_fkey" FOREIGN KEY ("currentRoundId") REFERENCES "JobRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResult" ADD CONSTRAINT "ScreeningResult_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantSkill" ADD CONSTRAINT "ApplicantSkill_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantSkill" ADD CONSTRAINT "ApplicantSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
