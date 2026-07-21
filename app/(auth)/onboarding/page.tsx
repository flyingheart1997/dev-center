import { Loader } from "@/components/ui/loader"
import { OnboardingCard } from "@/features/auth/components/onboarding-card"
import { Suspense } from "react"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OnboardingCard />
    </Suspense>
  )
}
