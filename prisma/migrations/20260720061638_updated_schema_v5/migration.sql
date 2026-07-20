/*
  Warnings:

  - You are about to drop the column `applicantId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `communicationScore` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `cultureScore` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `interviewerId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `problemSolvingScore` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `technicalScore` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `applicantId` on the `QuestionSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `applicantId` on the `ScreeningResult` table. All the data in the column will be lost.
  - You are about to drop the `Applicant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicantSkill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,provider,businessUnitId,branchId]` on the table `JobBoardConnection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicationId]` on the table `ScreeningResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationId` to the `ScreeningResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('Draft', 'Pending_Approval', 'Approved', 'Sent', 'Accepted', 'Rejected', 'Withdrawn');

-- CreateEnum
CREATE TYPE "RescheduleRequestedBy" AS ENUM ('Candidate', 'Interviewer');

-- CreateEnum
CREATE TYPE "RescheduleStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterEnum
ALTER TYPE "InterviewStatus" ADD VALUE 'Reschedule_Requested';

-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'Pending_Approval';

-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_currentRoundId_fkey";

-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_userId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantSkill" DROP CONSTRAINT "ApplicantSkill_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantSkill" DROP CONSTRAINT "ApplicantSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_interviewerId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionSubmission" DROP CONSTRAINT "QuestionSubmission_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "ScreeningResult" DROP CONSTRAINT "ScreeningResult_applicantId_fkey";

-- DropIndex
DROP INDEX "Interview_interviewerId_idx";

-- DropIndex
DROP INDEX "JobBoardConnection_organizationId_provider_key";

-- DropIndex
DROP INDEX "QuestionSubmission_applicantId_idx";

-- DropIndex
DROP INDEX "ScreeningResult_applicantId_key";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "BusinessUnit" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EmployeeInvitation" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "businessUnitId" TEXT,
ADD COLUMN     "departmentId" TEXT;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "applicantId",
DROP COLUMN "communicationScore",
DROP COLUMN "cultureScore",
DROP COLUMN "feedback",
DROP COLUMN "interviewerId",
DROP COLUMN "overallScore",
DROP COLUMN "problemSolvingScore",
DROP COLUMN "recommendation",
DROP COLUMN "technicalScore",
ADD COLUMN     "applicationId" TEXT NOT NULL,
ADD COLUMN     "isRescheduled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "isInternalOnly" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "JobBoardConnection" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "businessUnitId" TEXT;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "dataRetentionDays" INTEGER;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxBranches" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxBusinessUnits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxEmployees" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "QuestionSubmission" DROP COLUMN "applicantId",
ADD COLUMN     "applicationId" TEXT;

-- AlterTable
ALTER TABLE "ScreeningResult" DROP COLUMN "applicantId",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Applicant";

-- DropTable
DROP TABLE "ApplicantSkill";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "experienceYears" INTEGER,
    "currentCompany" TEXT,
    "currentDesignation" TEXT,
    "location" TEXT,
    "countryPermit" BOOLEAN,
    "criminalRecord" BOOLEAN,
    "isExistingEmployee" BOOLEAN,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "referrerId" TEXT,
    "currentRoundId" TEXT,
    "status" "ApplicantStatus" NOT NULL DEFAULT 'Applied',
    "resumeUrl" TEXT,
    "expectedSalary" DOUBLE PRECISION,
    "currentSalary" DOUBLE PRECISION,
    "noticePeriod" INTEGER,
    "source" TEXT,
    "rejectionReason" TEXT,
    "rejectionNotes" TEXT,
    "formResponses" JSONB,
    "screeningScore" INTEGER,
    "allowCrossBranchSharing" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scorecard" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "technicalScore" INTEGER,
    "communicationScore" INTEGER,
    "problemSolvingScore" INTEGER,
    "cultureScore" INTEGER,
    "overallScore" INTEGER,
    "recommendation" "Recommendation",
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scorecard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSkill" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApproval" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "feedback" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "JobApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "offeredSalary" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "targetStartDate" TIMESTAMP(3) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'Draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferApproval" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "feedback" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "OfferApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RescheduleRequest" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "requestedBy" "RescheduleRequestedBy" NOT NULL,
    "reason" TEXT NOT NULL,
    "proposedSlots" JSONB,
    "status" "RescheduleStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RescheduleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilitySlot" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT,
    "candidateId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentPool" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalentPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentPoolCandidate" (
    "id" TEXT NOT NULL,
    "talentPoolId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentPoolCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterviewInterviewers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterviewInterviewers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Application_candidateId_idx" ON "Application"("candidateId");

-- CreateIndex
CREATE INDEX "Application_referrerId_idx" ON "Application"("referrerId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_currentRoundId_idx" ON "Application"("currentRoundId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_candidateId_key" ON "Application"("jobId", "candidateId");

-- CreateIndex
CREATE INDEX "Scorecard_interviewId_idx" ON "Scorecard"("interviewId");

-- CreateIndex
CREATE INDEX "Scorecard_interviewerId_idx" ON "Scorecard"("interviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "Scorecard_interviewId_interviewerId_key" ON "Scorecard"("interviewId", "interviewerId");

-- CreateIndex
CREATE INDEX "CandidateSkill_candidateId_idx" ON "CandidateSkill"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateSkill_skillId_idx" ON "CandidateSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkill_candidateId_skillId_key" ON "CandidateSkill"("candidateId", "skillId");

-- CreateIndex
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");

-- CreateIndex
CREATE INDEX "AuditLog_employeeId_idx" ON "AuditLog"("employeeId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "JobApproval_approverId_idx" ON "JobApproval"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApproval_jobId_approverId_key" ON "JobApproval"("jobId", "approverId");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_applicationId_key" ON "Offer"("applicationId");

-- CreateIndex
CREATE INDEX "OfferApproval_approverId_idx" ON "OfferApproval"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferApproval_offerId_approverId_key" ON "OfferApproval"("offerId", "approverId");

-- CreateIndex
CREATE INDEX "RescheduleRequest_interviewId_idx" ON "RescheduleRequest"("interviewId");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_employeeId_idx" ON "AvailabilitySlot"("employeeId");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_candidateId_idx" ON "AvailabilitySlot"("candidateId");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_startTime_endTime_idx" ON "AvailabilitySlot"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "TalentPool_organizationId_idx" ON "TalentPool"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentPool_organizationId_name_key" ON "TalentPool"("organizationId", "name");

-- CreateIndex
CREATE INDEX "TalentPoolCandidate_talentPoolId_idx" ON "TalentPoolCandidate"("talentPoolId");

-- CreateIndex
CREATE INDEX "TalentPoolCandidate_candidateId_idx" ON "TalentPoolCandidate"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentPoolCandidate_talentPoolId_candidateId_key" ON "TalentPoolCandidate"("talentPoolId", "candidateId");

-- CreateIndex
CREATE INDEX "_InterviewInterviewers_B_index" ON "_InterviewInterviewers"("B");

-- CreateIndex
CREATE INDEX "EmployeeInvitation_businessUnitId_idx" ON "EmployeeInvitation"("businessUnitId");

-- CreateIndex
CREATE INDEX "EmployeeInvitation_branchId_idx" ON "EmployeeInvitation"("branchId");

-- CreateIndex
CREATE INDEX "EmployeeInvitation_departmentId_idx" ON "EmployeeInvitation"("departmentId");

-- CreateIndex
CREATE INDEX "JobBoardConnection_businessUnitId_idx" ON "JobBoardConnection"("businessUnitId");

-- CreateIndex
CREATE INDEX "JobBoardConnection_branchId_idx" ON "JobBoardConnection"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "JobBoardConnection_organizationId_provider_businessUnitId_b_key" ON "JobBoardConnection"("organizationId", "provider", "businessUnitId", "branchId");

-- CreateIndex
CREATE INDEX "QuestionSubmission_applicationId_idx" ON "QuestionSubmission"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningResult_applicationId_key" ON "ScreeningResult"("applicationId");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_currentRoundId_fkey" FOREIGN KEY ("currentRoundId") REFERENCES "JobRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResult" ADD CONSTRAINT "ScreeningResult_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scorecard" ADD CONSTRAINT "Scorecard_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scorecard" ADD CONSTRAINT "Scorecard_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBoardConnection" ADD CONSTRAINT "JobBoardConnection_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobBoardConnection" ADD CONSTRAINT "JobBoardConnection_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApproval" ADD CONSTRAINT "JobApproval_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApproval" ADD CONSTRAINT "JobApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferApproval" ADD CONSTRAINT "OfferApproval_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferApproval" ADD CONSTRAINT "OfferApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RescheduleRequest" ADD CONSTRAINT "RescheduleRequest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentPool" ADD CONSTRAINT "TalentPool_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentPoolCandidate" ADD CONSTRAINT "TalentPoolCandidate_talentPoolId_fkey" FOREIGN KEY ("talentPoolId") REFERENCES "TalentPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentPoolCandidate" ADD CONSTRAINT "TalentPoolCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterviewInterviewers" ADD CONSTRAINT "_InterviewInterviewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterviewInterviewers" ADD CONSTRAINT "_InterviewInterviewers_B_fkey" FOREIGN KEY ("B") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
