"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBranchSchema, CreateBranchInput } from "@/features/organization/schemas/organization-schemas"
import { trpc } from "@/lib/trpc/client"

export function useCreateBranchDialog(onOpenChange: (open: boolean) => void) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const form = useForm<CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: "",
      code: "",
      city: "",
      country: "",
      timezone: "UTC",
      address: "",
      isHeadOffice: false,
    },
  })

  const createBranchMutation = trpc.organization.createBranch.useMutation({
    onSuccess: () => {
      setSuccessMessage("Branch created successfully!")
      setErrorMessage(null)
      utils.organization.getBranches.invalidate()
      utils.organization.getSettings.invalidate()
      form.reset()
      setTimeout(() => {
        setSuccessMessage(null)
        onOpenChange(false)
      }, 1200)
    },
    onError: (err) => {
      setErrorMessage(err.message)
      setSuccessMessage(null)
    },
  })

  const onSubmit = form.handleSubmit((data: CreateBranchInput) => {
    createBranchMutation.mutate(data)
  })

  return {
    form,
    onSubmit,
    isPending: createBranchMutation.isPending,
    successMessage,
    errorMessage,
  }
}
