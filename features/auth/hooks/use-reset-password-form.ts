"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trpc } from "@/lib/trpc/client"
import { resetPasswordSchema, ResetPasswordInput } from "../schema/auth-schemas"

export function useResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    !token || !email ? { type: "error", text: "Invalid password reset link. Please request a new link." } : null
  )

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation()

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      email: email || "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = async (data: ResetPasswordInput) => {
    if (!token || !email) return
    setMessage(null)

    try {
      const res = await resetPasswordMutation.mutateAsync({
        token: data.token,
        email: data.email.trim(),
        newPassword: data.newPassword,
      })
      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to reset password." })
    }
  }

  return {
    email,
    token,
    form,
    loading: resetPasswordMutation.isPending || form.formState.isSubmitting,
    message,
    handleSubmit,
  }
}
