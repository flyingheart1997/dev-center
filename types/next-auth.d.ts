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
      candidateId?: string | null
      role?: EmployeeRole | string | null
      employeeStatus?: EmployeeStatus | string | null
      emailVerified?: Date | string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    organizationId?: string | null
    employeeId?: string | null
    candidateId?: string | null
    role?: EmployeeRole | string | null
    employeeStatus?: EmployeeStatus | string | null
    emailVerified?: Date | string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    organizationId?: string | null
    employeeId?: string | null
    candidateId?: string | null
    role?: EmployeeRole | string | null
    employeeStatus?: EmployeeStatus | string | null
    emailVerified?: Date | string | null
  }
}
