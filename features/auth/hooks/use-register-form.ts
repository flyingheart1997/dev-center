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
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<"candidate" | "employee">("candidate")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const candidateForm = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", phone: "" },
  })

  const employeeForm = useForm<EmployeeRegisterInput>({
    resolver: zodResolver(employeeRegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", organizationId: "", invitationToken: "" },
  })

  const registerCandidateMutation = trpc.auth.registerCandidate.useMutation()
  const registerEmployeeMutation = trpc.auth.registerEmployee.useMutation()

  const handleNextStep = async () => {
    setMessage(null)
    const activeForm = userType === "candidate" ? candidateForm : employeeForm
    const isEmailValid = await activeForm.trigger("email")
    if (isEmailValid) {
      setStep(2)
    }
  }

  const handleBackToStep1 = () => {
    setStep(1)
  }

  const handleCandidateRegister = async (data: CandidateRegisterInput) => {
    setMessage(null)
    try {
      const res = await registerCandidateMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone?.trim() || undefined,
      })
      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`)
      }, 2000)
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
      }, 2000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create account." })
    }
  }

  return {
    step,
    setStep,
    userType,
    setUserType,
    candidateForm,
    employeeForm,
    handleNextStep,
    handleBackToStep1,
    handleCandidateRegister,
    handleEmployeeRegister,
    loading:
      candidateForm.formState.isSubmitting ||
      employeeForm.formState.isSubmitting ||
      registerCandidateMutation.isPending ||
      registerEmployeeMutation.isPending,
    message,
  }
}
