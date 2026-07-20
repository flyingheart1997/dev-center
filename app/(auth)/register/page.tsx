import { Loader } from "@/components/ui/loader"
import { RegisterCard } from "@/features/auth/components/register-card"
import { Suspense } from "react"

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterCard />
    </Suspense>
  )
}
