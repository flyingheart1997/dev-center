"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inviteEmployeeSchema, InviteEmployeeInput } from "../schemas/organization-schemas"
import { EmployeeRole } from "@/types/enums"
import { trpc } from "@/lib/trpc/client"

export function useInviteEmployeeDialog(onOpenChange: (open: boolean) => void) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const form = useForm<InviteEmployeeInput>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: {
      email: "",
      role: EmployeeRole.INTERVIEWER,
    },
  })

  const inviteMutation = trpc.organization.sendInvite.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message || "Invitation sent successfully!")
      setErrorMessage(null)
      utils.organization.getSettings.invalidate()
      form.reset()
      setTimeout(() => {
        setSuccessMessage(null)
        onOpenChange(false)
      }, 1200)
    },
    onError: (err: { message?: string }) => {
      setErrorMessage(err.message || "Failed to send invitation.")
      setSuccessMessage(null)
    },
  })

  const onSubmit = form.handleSubmit((data: InviteEmployeeInput) => {
    inviteMutation.mutate(data)
  })

  return {
    form,
    onSubmit,
    isPending: inviteMutation.isPending,
    successMessage,
    errorMessage,
  }
}
