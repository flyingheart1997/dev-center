"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trpc } from "@/lib/trpc/client"
import { forgotPasswordSchema, ForgotPasswordInput } from "../schema/auth-schemas"

export function useForgotPasswordForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const requestResetMutation = trpc.auth.requestPasswordReset.useMutation()

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const handleSubmit = async (data: ForgotPasswordInput) => {
    setMessage(null)
    try {
      const res = await requestResetMutation.mutateAsync({ email: data.email.trim() })
      setMessage({ type: "success", text: res.message })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to process request." })
    }
  }

  return {
    form,
    loading: requestResetMutation.isPending || form.formState.isSubmitting,
    message,
    handleSubmit,
  }
}
