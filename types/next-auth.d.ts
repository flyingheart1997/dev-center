import { DefaultSession } from "next-auth"
import { EmployeeRole, EmployeeStatus } from "@/types/enums"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      organizationId?: string | null
      employeeId?: string | null
      branchId?: string | null
      businessUnitId?: string | null
      candidateId?: string | null
      role?: EmployeeRole | string | null
      employeeStatus?: EmployeeStatus | string | null
      emailVerified?: Date | string | null
      tokenVersion?: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    organizationId?: string | null
    employeeId?: string | null
    branchId?: string | null
    businessUnitId?: string | null
    candidateId?: string | null
    role?: EmployeeRole | string | null
    employeeStatus?: EmployeeStatus | string | null
    emailVerified?: Date | string | null
    tokenVersion?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    organizationId?: string | null
    employeeId?: string | null
    branchId?: string | null
    businessUnitId?: string | null
    candidateId?: string | null
    role?: EmployeeRole | string | null
    employeeStatus?: EmployeeStatus | string | null
    emailVerified?: Date | string | null
    tokenVersion?: number
  }
}
