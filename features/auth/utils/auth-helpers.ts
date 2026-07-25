import { prisma } from "@/lib/prisma"

export async function fetchUserWithProfilesByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      employees: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      candidates: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export function buildSessionUserPayload(user: {
  id: string
  email: string
  name: string | null
  image: string | null
  tokenVersion?: number
  employees: Array<{ id: string; organizationId: string; branchId?: string | null; businessUnitId?: string | null; role: any; status: any }>
  candidates: Array<{ id: string }>
}) {
  const activeEmployee = user.employees[0]
  const activeCandidate = user.candidates[0]

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    tokenVersion: user.tokenVersion ?? 0,
    organizationId: activeEmployee?.organizationId || null,
    employeeId: activeEmployee?.id || null,
    branchId: activeEmployee?.branchId || null,
    businessUnitId: activeEmployee?.businessUnitId || null,
    candidateId: activeCandidate?.id || null,
    role: activeEmployee?.role || null,
    employeeStatus: activeEmployee?.status || null,
  }
}
