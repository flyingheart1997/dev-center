"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { trpc } from "@/lib/trpc/client"

export function useVerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    !token
      ? {
          type: "info",
          text: `A verification link has been sent to ${email || "your email address"}. Please check your inbox and click the link to verify your account.`,
        }
      : null
  )

  const verifyMutation = trpc.auth.verifyEmailToken.useMutation()

  useEffect(() => {
    if (token && email) {
      verifyMutation
        .mutateAsync({ token, email: email.trim() })
        .then((res) => {
          setStatus({ type: "success", text: res.message })
        })
        .catch((err: any) => {
          setStatus({ type: "error", text: err.message || "Verification failed." })
        })
    }
  }, [token, email])

  return {
    loading: verifyMutation.isPending,
    status,
    email,
    token,
  }
}
