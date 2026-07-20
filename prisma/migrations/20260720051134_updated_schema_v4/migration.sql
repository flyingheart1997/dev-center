/*
  Warnings:

  - The values [Admin] on the enum `EmployeeRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeRole_new" AS ENUM ('Owner', 'Global_Admin', 'Business_Unit_Admin', 'Branch_Admin', 'Recruiter', 'Interviewer', 'Hiring_Manager');
ALTER TABLE "public"."Employee" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."EmployeeInvitation" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "role" TYPE "EmployeeRole_new" USING ("role"::text::"EmployeeRole_new");
ALTER TABLE "EmployeeInvitation" ALTER COLUMN "role" TYPE "EmployeeRole_new" USING ("role"::text::"EmployeeRole_new");
ALTER TYPE "EmployeeRole" RENAME TO "EmployeeRole_old";
ALTER TYPE "EmployeeRole_new" RENAME TO "EmployeeRole";
DROP TYPE "public"."EmployeeRole_old";
ALTER TABLE "Employee" ALTER COLUMN "role" SET DEFAULT 'Interviewer';
ALTER TABLE "EmployeeInvitation" ALTER COLUMN "role" SET DEFAULT 'Interviewer';
COMMIT;

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "allowCrossBranchSharing" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "businessUnitId" TEXT,
ADD COLUMN     "departmentId" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "businessUnitId" TEXT,
ADD COLUMN     "departmentId" TEXT;

-- CreateTable
CREATE TABLE "BusinessUnit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessUnitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "isHeadOffice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessUnit_organizationId_idx" ON "BusinessUnit"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUnit_organizationId_name_key" ON "BusinessUnit"("organizationId", "name");

-- CreateIndex
CREATE INDEX "Branch_organizationId_idx" ON "Branch"("organizationId");

-- CreateIndex
CREATE INDEX "Branch_businessUnitId_idx" ON "Branch"("businessUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_businessUnitId_name_key" ON "Branch"("businessUnitId", "name");

-- CreateIndex
CREATE INDEX "Department_organizationId_idx" ON "Department"("organizationId");

-- CreateIndex
CREATE INDEX "Department_branchId_idx" ON "Department"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_branchId_name_key" ON "Department"("branchId", "name");

-- CreateIndex
CREATE INDEX "Employee_businessUnitId_idx" ON "Employee"("businessUnitId");

-- CreateIndex
CREATE INDEX "Employee_branchId_idx" ON "Employee"("branchId");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Job_businessUnitId_idx" ON "Job"("businessUnitId");

-- CreateIndex
CREATE INDEX "Job_branchId_idx" ON "Job"("branchId");

-- CreateIndex
CREATE INDEX "Job_departmentId_idx" ON "Job"("departmentId");

-- AddForeignKey
ALTER TABLE "BusinessUnit" ADD CONSTRAINT "BusinessUnit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
