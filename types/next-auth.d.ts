import { DefaultSession } from "next-auth"
import { EmployeeRole, EmployeeStatus } from "@prisma/client"

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
      role?: EmployeeRole | null
      employeeStatus?: EmployeeStatus | null
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
    role?: EmployeeRole | null
    employeeStatus?: EmployeeStatus | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    organizationId?: string | null
    employeeId?: string | null
    candidateId?: string | null
    role?: EmployeeRole | null
    employeeStatus?: EmployeeStatus | null
  }
}
