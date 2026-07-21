import React, { Suspense } from "react"
import { OnboardingCard } from "@/features/auth/components/onboarding-card"
import { Loader } from "@/components/ui/loader"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OnboardingCard />
    </Suspense>
  )
}
