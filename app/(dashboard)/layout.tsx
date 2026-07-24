import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OrganizationDashboard } from "@/features/organization/components/organization-dashboard"
import { CandidateDashboard } from "@/features/candidate-prep/components/candidate-dashboard"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isOrgUser = !!(session?.user?.organizationId || session?.user?.employeeId)

  const Shell = isOrgUser ? OrganizationDashboard : CandidateDashboard

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Shell>{children}</Shell>
    </main>
  )
}
