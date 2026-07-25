import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CandidateDashboard } from "@/features/dashboard/components/candidate-dashboard"
import { OrganizationDashboard } from "@/features/dashboard/components/organization-dashboard"
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const isOrgUser = !!(session?.user?.organizationId || session?.user?.employeeId)

  return isOrgUser ? <OrganizationDashboard /> : <CandidateDashboard />
}
