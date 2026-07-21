import React, { Suspense } from "react"
import { VerifyEmailCard } from "@/features/auth/components/verify-email-card"
import { Loader } from "@/components/ui/loader"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmailCard />
    </Suspense>
  )
}
