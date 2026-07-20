-- CreateTable
CREATE TABLE "CandidatePlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "mockInterviewsLimit" INTEGER NOT NULL,
    "codingPracticeLimit" INTEGER NOT NULL,
    "resumeReviewsLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidatePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roleCategory" TEXT NOT NULL,
    "overallScore" INTEGER,
    "voiceScore" INTEGER,
    "transcript" TEXT,
    "aiFeedback" TEXT,
    "improvementTips" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeReview" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "atsScore" INTEGER,
    "keywordMatchScore" INTEGER,
    "strengths" JSONB,
    "improvements" JSONB,
    "missingKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidatePlan_name_key" ON "CandidatePlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubscription_userId_key" ON "CandidateSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubscription_stripeCustomerId_key" ON "CandidateSubscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubscription_stripeSubscriptionId_key" ON "CandidateSubscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "PracticeSession_candidateId_idx" ON "PracticeSession"("candidateId");

-- CreateIndex
CREATE INDEX "ResumeReview_candidateId_idx" ON "ResumeReview"("candidateId");

-- AddForeignKey
ALTER TABLE "CandidateSubscription" ADD CONSTRAINT "CandidateSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubscription" ADD CONSTRAINT "CandidateSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CandidatePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeReview" ADD CONSTRAINT "ResumeReview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
