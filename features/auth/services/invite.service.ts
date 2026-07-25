import { TRPCError } from "@trpc/server"
import { EmployeeRole, EmployeeStatus } from "@/types/enums"
import type { PrismaClient } from "@/prisma/generated/client"

export function requireOrgAdmin(
  user: { role?: string | null; organizationId?: string | null },
  organizationId?: string
) {
  if (!user.organizationId || (organizationId && user.organizationId !== organizationId)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You do not belong to this organization." })
  }
  if (user.role !== EmployeeRole.OWNER && user.role !== EmployeeRole.GLOBAL_ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only an organization owner or admin can manage invitations." })
  }
}

export async function acceptEmployeeInvitation(
  prisma: PrismaClient,
  { token, email, userId }: { token: string; email: string; userId: string }
) {
  const invite = await prisma.employeeInvitation.findUnique({ where: { token } })

  if (!invite || invite.email.toLowerCase() !== email.toLowerCase()) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid invitation." })
  }

  if (invite.expiresAt < new Date()) {
    await prisma.employeeInvitation.delete({ where: { id: invite.id } }).catch(() => {})
    throw new TRPCError({ code: "BAD_REQUEST", message: "This invitation has expired." })
  }

  // Audit Fix 2: Strict Dual-Role Isolation Check
  // Check if user is ALREADY an Employee or ALREADY a Candidate
  const [existingEmployee, existingCandidate] = await Promise.all([
    prisma.employee.findFirst({ where: { userId } }),
    prisma.candidate.findUnique({ where: { userId } }),
  ])

  if (existingEmployee) {
    throw new TRPCError({ code: "CONFLICT", message: "You are already registered as an employee of an organization." })
  }

  if (existingCandidate) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "This email address is registered as a Candidate account. Candidates and employees must use separate email accounts. Please sign up with your work email to accept employee invitations.",
    })
  }

  const [employee] = await prisma.$transaction([
    prisma.employee.create({
      data: {
        organizationId: invite.organizationId,
        businessUnitId: invite.businessUnitId,
        branchId: invite.branchId,
        departmentId: invite.departmentId,
        userId,
        role: invite.role,
        status: EmployeeStatus.ACTIVE,
      },
    }),
    prisma.employeeInvitation.delete({ where: { id: invite.id } }),
  ])

  return employee
}
