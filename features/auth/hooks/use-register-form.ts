"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { RegisterUserInput, registerUserSchema } from "../schema/auth-schemas"


export function useRegisterForm() {
  const router = useRouter()
  const trpcUtils = trpc.useUtils()

  const [step, setStep] = useState<1 | 2>(1)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const registerForm = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const registerUserMutation = trpc.auth.registerUser.useMutation()

  const handleNextStep = async () => {
    setMessage(null)
    const isEmailValid = await registerForm.trigger("email")
    if (!isEmailValid) return

    const emailVal = registerForm.getValues("email")
    const email = (typeof emailVal === "string" ? emailVal : "").trim().toLowerCase()
    if (!email) return

    setCheckingEmail(true)

    try {
      const res = await trpcUtils.auth.checkEmailExists.fetch({ email })
      if (res.exists) {
        registerForm.setError("email", { type: "manual", message: "Email already in use, please login." })
        setCheckingEmail(false)
        return
      }
      setStep(2)
    } catch {
      setStep(2)
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setMessage(null)
  }

  const handleRegister = async (data: RegisterUserInput) => {
    setMessage(null)
    try {
      const res = await registerUserMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`)
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create account." })
    }
  }

  return {
    step,
    checkingEmail,
    registerForm,
    handleNextStep,
    handleBackToStep1,
    handleRegister,
    loading: checkingEmail || registerForm.formState.isSubmitting || registerUserMutation.isPending,
    message,
    setMessage,
  }
}
