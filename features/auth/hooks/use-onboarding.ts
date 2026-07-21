"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { trpc } from "@/lib/trpc/client"
import { isPublicEmailDomain } from "../utils/domain-utils"

export function useOnboarding() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [userType, setUserType] = useState<"candidate" | "employee" | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const onboardCandidateMutation = trpc.auth.onboardCandidate.useMutation()

  const userEmail = session?.user?.email || ""
  const isPublicDomain = isPublicEmailDomain(userEmail)

  const handleContinue = async () => {
    if (!userType) return
    setMessage(null)
    if (userType === "candidate") {
      try {
        const res = await onboardCandidateMutation.mutateAsync()
        setMessage({ type: "success", text: res.message })
        // Refresh NextAuth session JWT cookie with new Candidate ID
        await update()
        setTimeout(() => {
          router.push("/candidate")
          router.refresh()
        }, 2000)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "Failed to complete onboarding." })
      }
    } else {
      if (isPublicDomain) {
        setMessage({
          type: "error",
          text: "Please use your company's work email to create an organization. Personal email addresses (such as gmail or yahoo) cannot be used.",
        })
        return
      }
      router.push("/setup-org")
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return {
    userType,
    setUserType,
    isPublicDomain,
    message,
    handleContinue,
    handleSignOut,
    loading: onboardCandidateMutation.isPending,
  }
}
