import React, { Suspense } from "react"
import { ForgotPasswordCard } from "@/features/auth/components/forgot-password-card"
import { Loader } from "@/components/ui/loader"

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPasswordCard />
    </Suspense>
  )
}
