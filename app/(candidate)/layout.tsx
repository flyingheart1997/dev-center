import React from "react"
import { CandidateDashboard } from "@/features/candidate-prep/components/candidate-dashboard"

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <CandidateDashboard children={children} />
    </main>
  )
}
