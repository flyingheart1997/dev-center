"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { RegisterUserInput, registerUserSchema } from "../schema/auth-schemas"
import { isPublicEmailDomain } from "../utils/domain-utils"
import { RegisterIntent } from "../components/register-intent-step"

interface InviteDetails {
  organizationName: string
  role: string
}

export function useRegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trpcUtils = trpc.useUtils()
  const inviteToken = searchParams?.get("inviteToken") || null

  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [intent, setIntentState] = useState<RegisterIntent | null>(null)
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const registerForm = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { name: "", email: "", intent: "candidate", password: "", confirmPassword: "" },
  })

  const registerUserMutation = trpc.auth.registerUser.useMutation()

  // Social sign-up can bounce back here with an error (e.g. rejected in the OAuth signIn
  // callback) after a full page redirect, so this can't be shown inline like the client-side
  // checks above — it has to be read from the URL once on mount.
  useEffect(() => {
    const errorParam = searchParams?.get("error")
    if (!errorParam) return
    if (errorParam === "WorkEmailRequired") {
      setMessage({
        type: "error",
        text: "Organization accounts require a work email. Please use your company email to sign up.",
      })
    } else {
      setMessage({ type: "error", text: "An error occurred during sign-up. Please try again." })
    }
  }, [searchParams])

  // An invite link implies organization intent and a fixed email — skip Step 0 entirely.
  useEffect(() => {
    if (!inviteToken) return
    trpcUtils.auth.getInviteDetails
      .fetch({ token: inviteToken })
      .then((invite) => {
        setInviteDetails({ organizationName: invite.organizationName, role: invite.role })
        setIntentState("organization")
        registerForm.setValue("intent", "organization")
        registerForm.setValue("email", invite.email)
        setStep(1)
      })
      .catch((err: any) => {
        setMessage({ type: "error", text: err.message || "This invitation link is invalid or has expired." })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteToken])

  const setIntent = (next: RegisterIntent) => {
    setIntentState(next)
    registerForm.setValue("intent", next)
  }

  const handleIntentContinue = () => {
    if (!intent) return
    setMessage(null)
    setStep(1)
  }

  const handleNextStep = async () => {
    setMessage(null)
    const isValid = await registerForm.trigger(["name", "email"])
    if (!isValid) return

    const emailVal = registerForm.getValues("email")
    const email = (typeof emailVal === "string" ? emailVal : "").trim().toLowerCase()
    if (!email) return

    if (intent === "organization" && isPublicEmailDomain(email)) {
      registerForm.setError("email", {
        type: "manual",
        message: "Organization accounts require a work email (e.g. alice@company.com).",
      })
      return
    }

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

  const handleBackStep = () => {
    setMessage(null)
    if (step === 2) {
      setStep(1)
    } else if (step === 1 && !inviteDetails) {
      setStep(0)
    }
  }

  const handleRegister = async (data: RegisterUserInput) => {
    setMessage(null)
    try {
      const res = await registerUserMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        intent: data.intent,
        password: data.password,
        confirmPassword: data.confirmPassword,
        inviteToken: inviteToken || undefined,
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
    intent,
    setIntent,
    inviteDetails,
    checkingEmail,
    registerForm,
    handleIntentContinue,
    handleNextStep,
    handleBackStep,
    handleRegister,
    loading: checkingEmail || registerForm.formState.isSubmitting || registerUserMutation.isPending,
    message,
    setMessage,
  }
}
