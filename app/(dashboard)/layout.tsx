import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout"

export default async function MainDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isOrgUser = !!(session?.user?.organizationId || session?.user?.employeeId)
  const dashboardType: "organization" | "candidate" = isOrgUser ? "organization" : "candidate"

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <DashboardLayout dashboardType={dashboardType}>{children}</DashboardLayout>
    </main>
  )
}
