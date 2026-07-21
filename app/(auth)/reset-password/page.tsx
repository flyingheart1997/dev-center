import React, { Suspense } from "react"
import { ResetPasswordCard } from "@/features/auth/components/reset-password-card"
import { Loader } from "@/components/ui/loader"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordCard />
    </Suspense>
  )
}
