import React, { Suspense } from "react"
import { PendingApprovalCard } from "@/features/auth/components/pending-approval-card"
import { Loader } from "@/components/ui/loader"

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PendingApprovalCard />
    </Suspense>
  )
}
