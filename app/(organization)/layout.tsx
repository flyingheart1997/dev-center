import React from "react"
import { OrganizationDashboard } from "@/features/organization/components/organization-dashboard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <OrganizationDashboard children={children} />
    </main>
  )
}
