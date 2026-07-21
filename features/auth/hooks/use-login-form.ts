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
  const trpcUtils = trpc.useUtils()
  const sendOtpMutation = trpc.auth.sendLoginOtp.useMutation()

  const [step, setStep] = useState<1 | 2>(1)
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("password")
  const [otpSent, setOtpSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // 60-second cooldown timer effect for OTP resending
  useEffect(() => {
    if (resendCooldown <= 0) return

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 2000)

    return () => clearInterval(interval)
  }, [resendCooldown])

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

    setLoading(true)
    try {
      const res = await trpcUtils.auth.checkEmailExists.fetch({ email: emailToValidate.trim() })
      if (!res.exists) {
        const activeForm = loginMethod === "password" ? passwordForm : otpForm
        activeForm.setError("email", { message: "This email is not registered. Please create an account first." })
        return
      }

      // Synchronize email across both forms
      passwordForm.setValue("email", emailToValidate.trim())
      otpForm.setValue("email", emailToValidate.trim())

      setStep(2)
    } catch (error) {
      console.error("Failed to check email", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setOtpSent(false)
    setMessage(null)
  }

  const handlePasswordLogin = async (data: LoginPasswordInput) => {
    setMessage(null)
    setLoading(true)
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
        router.refresh()
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." })
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (email: string) => {
    if (resendCooldown > 0) return
    setMessage(null)
    setLoading(true)
    try {
      const res = await sendOtpMutation.mutateAsync({ email: email.trim() })
      setOtpSent(true)
      setResendCooldown(60) // 60s cooldown timer
      setMessage({ type: "success", text: res.message })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send OTP code." })
    } finally {
      setLoading(false)
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
    setLoading(true)
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
        router.refresh()
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." })
    } finally {
      setLoading(false)
    }
  }

  const isFormLoading =
    loading ||
    passwordForm.formState.isSubmitting ||
    otpForm.formState.isSubmitting ||
    sendOtpMutation.isPending

  const getOtpSubmitButtonText = () => {
    if (isFormLoading) {
      return otpSent ? "Signing in..." : "Sending OTP Code..."
    }
    return otpSent ? "Verify Code & Sign in" : "Send OTP Code"
  }

  const getResendButtonText = () => {
    if (resendCooldown > 0) {
      return `Resend OTP in ${resendCooldown}s`
    }
    return "Didn't receive code? Resend OTP"
  }

  return {
    step,
    setStep,
    loginMethod,
    setLoginMethod,
    otpSent,
    setOtpSent,
    resendCooldown,
    message,
    passwordForm,
    otpForm,
    handleContinueToStep2,
    handleBackToStep1,
    handlePasswordLogin,
    handleOtpLogin,
    handleSendOtp,
    loading: isFormLoading,
    otpSubmitButtonText: getOtpSubmitButtonText(),
    resendButtonText: getResendButtonText(),
    isResendDisabled: isFormLoading || resendCooldown > 0,
  }
}
