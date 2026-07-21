"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import {
  loginOtpSchema,
  loginPasswordSchema,
  LoginOtpInput,
  LoginPasswordInput,
} from "../schema/auth-schemas"

export function useLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("password")
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    if (errorParam) {
      if (errorParam === "OAuthSignin" || errorParam === "Configuration") {
        setMessage({
          type: "error",
          text: "Social sign-in provider is not configured or client keys are missing. Please check your environment variables.",
        })
      } else if (errorParam === "OAuthCallback") {
        setMessage({
          type: "error",
          text: "Could not complete sign in with social provider. Please try again.",
        })
      } else if (errorParam === "AccessDenied") {
        setMessage({
          type: "error",
          text: "Access denied by social provider.",
        })
      } else if (errorParam === "OAuthAccountNotRegistered") {
        setMessage({
          type: "error",
          text: "This email is not registered. Please create an account first.",
        })
      } else {
        setMessage({
          type: "error",
          text: "An error occurred during authentication. Please try again.",
        })
      }
    }
  }, [searchParams])

  // Password Form
  const passwordForm = useForm<LoginPasswordInput>({
    resolver: zodResolver(loginPasswordSchema),
    defaultValues: { email: "", password: "" },
  })

  // OTP Form
  const otpForm = useForm<LoginOtpInput>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: { email: "", otpCode: "" },
  })

  const sendOtpMutation = trpc.auth.sendLoginOtp.useMutation()
  const trpcUtils = trpc.useUtils()
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const handleContinueToStep2 = async () => {
    setMessage(null)
    const emailToValidate =
      loginMethod === "password"
        ? passwordForm.getValues("email")
        : otpForm.getValues("email")

    if (!emailToValidate || !emailToValidate.includes("@")) {
      const activeForm = loginMethod === "password" ? passwordForm : otpForm
      activeForm.setError("email", { message: "Please enter a valid email address" })
      return
    }

    // Check if email is registered
    setIsCheckingEmail(true)
    try {
      const res = await trpcUtils.auth.checkEmailExists.fetch({ email: emailToValidate.trim() })
      if (!res.exists) {
        const activeForm = loginMethod === "password" ? passwordForm : otpForm
        activeForm.setError("email", { message: "This email is not registered. Please create an account first." })
        setIsCheckingEmail(false)
        return
      }
    } catch (error) {
      console.error("Failed to check email", error)
    }
    setIsCheckingEmail(false)

    // Synchronize email across both forms
    passwordForm.setValue("email", emailToValidate.trim())
    otpForm.setValue("email", emailToValidate.trim())

    setStep(2)
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setOtpSent(false)
    setMessage(null)
  }

  const handlePasswordLogin = async (data: LoginPasswordInput) => {
    setMessage(null)
    try {
      const res = await signIn("credentials-password", {
        redirect: false,
        email: data.email.trim(),
        password: data.password,
      })

      if (res?.error) {
        setMessage({ type: "error", text: res.error })
      } else {
        setMessage({ type: "success", text: "Logged in successfully! Redirecting..." })
        router.push("/dashboard")
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." })
    }
  }

  const handleSendOtp = async (email: string) => {
    setMessage(null)
    try {
      const res = await sendOtpMutation.mutateAsync({ email: email.trim() })
      setOtpSent(true)
      setMessage({ type: "success", text: res.message })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send OTP code." })
    }
  }

  const handleOtpLogin = async (data: LoginOtpInput) => {
    if (!otpSent) {
      await handleSendOtp(data.email)
      return
    }

    if (!data.otpCode || data.otpCode.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP code." })
      return
    }

    setMessage(null)
    try {
      const res = await signIn("credentials-otp", {
        redirect: false,
        email: data.email.trim(),
        otp: data.otpCode,
      })

      if (res?.error) {
        setMessage({ type: "error", text: res.error })
      } else {
        setMessage({ type: "success", text: "Logged in successfully! Redirecting..." })
        router.push("/dashboard")
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." })
    }
  }

  return {
    step,
    setStep,
    loginMethod,
    setLoginMethod,
    otpSent,
    setOtpSent,
    message,
    passwordForm,
    otpForm,
    handleContinueToStep2,
    handleBackToStep1,
    handlePasswordLogin,
    handleOtpLogin,
    handleSendOtp,
    isCheckingEmail,
    loading: passwordForm.formState.isSubmitting || sendOtpMutation.isPending || otpForm.formState.isSubmitting,
  }
}
