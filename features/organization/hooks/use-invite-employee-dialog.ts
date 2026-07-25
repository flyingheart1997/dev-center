"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inviteEmployeeSchema, InviteEmployeeInput } from "@/features/auth/schema/auth-schemas"
import { trpc } from "@/lib/trpc/client"
import { EmployeeRole } from "@/types/enums"

export function useInviteEmployeeDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: branches } = trpc.organization.getBranches.useQuery(undefined, {
    enabled: open,
  })

  const form = useForm<InviteEmployeeInput>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: {
      email: "",
      role: EmployeeRole.RECRUITER,
    },
  })

  const sendInviteMutation = trpc.organization.sendInvite.useMutation({
    onSuccess: (res) => {
      setSuccessMessage(res.message)
      setErrorMessage(null)
      form.reset()
      setTimeout(() => {
        setSuccessMessage(null)
        onOpenChange(false)
      }, 1500)
    },
    onError: (err) => {
      setErrorMessage(err.message)
      setSuccessMessage(null)
    },
  })

  const onSubmit = form.handleSubmit((data: InviteEmployeeInput) => {
    sendInviteMutation.mutate(data)
  })

  return {
    form,
    branches,
    onSubmit,
    isPending: sendInviteMutation.isPending,
    successMessage,
    errorMessage,
  }
}
