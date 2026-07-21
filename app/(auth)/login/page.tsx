import React, { Suspense } from "react"
import { LoginCard } from "@/features/auth/components/login-card"
import { Loader } from "@/components/ui/loader"

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginCard />
    </Suspense>
  )
}
