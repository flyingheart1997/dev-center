import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OrganizationDashboardHome } from "@/features/organization/components/organization-dashboard-home"
import { CandidateDashboardHome } from "@/features/candidate-prep/components/candidate-dashboard-home"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const isOrgUser = !!(session?.user?.organizationId || session?.user?.employeeId)

  return isOrgUser ? <OrganizationDashboardHome /> : <CandidateDashboardHome />
}
