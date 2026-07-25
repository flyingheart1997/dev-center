"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { updateUserProfileSchema, UpdateUserProfileInput } from "@/features/organization/schemas/organization-schemas"
import { trpc } from "@/lib/trpc/client"

export function useUserProfileDialog(onOpenChange: (open: boolean) => void) {
  const { data: session, update: updateSession } = useSession()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<UpdateUserProfileInput>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: "",
      image: "",
      phone: "",
      location: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
    },
  })

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        image: session.user.image || "",
        phone: "",
        location: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
      })
    }
  }, [session, form])

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Profile updated successfully!")
      setErrorMessage(null)
      await updateSession()
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

  const onSubmit = form.handleSubmit((data: UpdateUserProfileInput) => {
    updateProfileMutation.mutate(data)
  })

  return {
    form,
    onSubmit,
    isPending: updateProfileMutation.isPending,
    successMessage,
    errorMessage,
  }
}
