"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import {
  candidateRegisterSchema,
  employeeRegisterSchema,
  CandidateRegisterInput,
  EmployeeRegisterInput,
} from "../schema/auth-schemas"

export function useRegisterForm() {
  const router = useRouter()
  const trpcUtils = trpc.useUtils()

  const [step, setStep] = useState<0 | 1 | 2>(0) // Step 0: Intent, Step 1: Email & Social, Step 2: Credentials
  const [userType, setUserType] = useState<"candidate" | "employee">("candidate")
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const candidateForm = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const employeeForm = useForm<EmployeeRegisterInput>({
    resolver: zodResolver(employeeRegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", organizationId: "", invitationToken: "" },
  })

  const registerCandidateMutation = trpc.auth.registerCandidate.useMutation()
  const registerEmployeeMutation = trpc.auth.registerEmployee.useMutation()

  const handleSelectUserType = (type: "candidate" | "employee") => {
    setUserType(type)
    setStep(1)
    setMessage(null)
  }

  const handleNextStep = async () => {
    setMessage(null)
    const activeForm = userType === "candidate" ? candidateForm : employeeForm
    const isEmailValid = await activeForm.trigger("email" as any)
    if (!isEmailValid) return

    const emailVal = activeForm.getValues("email" as any)
    const email = (typeof emailVal === "string" ? emailVal : "").trim().toLowerCase()
    if (!email) return

    setCheckingEmail(true)

    try {
      const res = await trpcUtils.auth.checkEmailExists.fetch({ email })
      if (res.exists) {
        setMessage({
          type: "error",
          text: "An account already exists with this email address. Please log in.",
        })
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

  const handleBackToStep0 = () => {
    setStep(0)
    setMessage(null)
  }

  const handleCandidateRegister = async (data: CandidateRegisterInput) => {
    setMessage(null)
    try {
      const res = await registerCandidateMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`)
      }, 1500)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create account." })
    }
  }

  const handleEmployeeRegister = async (data: EmployeeRegisterInput) => {
    setMessage(null)
    try {
      const res = await registerEmployeeMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        organizationId: data.organizationId || undefined,
        invitationToken: data.invitationToken || undefined,
      })
      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`)
      }, 1500)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create account." })
    }
  }

  return {
    step,
    setStep,
    userType,
    setUserType,
    checkingEmail,
    candidateForm,
    employeeForm,
    handleSelectUserType,
    handleNextStep,
    handleBackToStep1,
    handleBackToStep0,
    handleCandidateRegister,
    handleEmployeeRegister,
    loading:
      checkingEmail ||
      candidateForm.formState.isSubmitting ||
      employeeForm.formState.isSubmitting ||
      registerCandidateMutation.isPending ||
      registerEmployeeMutation.isPending,
    message,
    setMessage,
  }
}
