"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { trpc } from "@/lib/trpc/client"

export function useVerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const inviteToken = searchParams.get("inviteToken")
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    !token
      ? {
        type: "info",
        text: `A verification link has been sent to ${email || "your email address"}. Please check your inbox and click the link to verify your account.`,
      }
      : null
  )

  const verifyMutation = trpc.auth.verifyEmailToken.useMutation()
  const resendMutation = trpc.auth.resendVerificationEmail.useMutation()

  useEffect(() => {
    if (token && email) {
      const trimmedEmail = email.trim()

      verifyMutation
        .mutateAsync({ token, email: trimmedEmail, inviteToken: inviteToken || undefined })
        .then(async (res) => {
          setStatus({ type: "success", text: res.message })

          const signInResult = await signIn("credentials-autologin", {
            redirect: false,
            email: trimmedEmail,
            token: res.autoLoginToken,
          })

          setTimeout(() => {
            if (signInResult?.ok) {
              router.push(res.intent === "organization" ? "/setup-org" : "/dashboard")
            } else {
              // Auto-login failed (e.g. token already consumed) — fall back to manual login.
              router.push(`/login?email=${encodeURIComponent(trimmedEmail)}&verified=true`)
            }
            router.refresh()
          }, 1000)
        })
        .catch((err: any) => {
          setStatus({ type: "error", text: err.message || "Verification failed." })
        })
    }
  }, [token, email])

  const handleResend = async (targetEmail: string) => {
    try {
      const res = await resendMutation.mutateAsync({ email: targetEmail })
      setStatus({ type: "success", text: res.message })
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed to resend email." })
    }
  }

  return {
    loading: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    status,
    email,
    token,
    handleResend,
  }
}
