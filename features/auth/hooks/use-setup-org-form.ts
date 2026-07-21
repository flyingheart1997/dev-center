"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { setupOrgSchema, SetupOrgInput } from "../schema/auth-schemas"

export function useSetupOrgForm() {
  const router = useRouter()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const form = useForm<SetupOrgInput>({
    resolver: zodResolver(setupOrgSchema),
    defaultValues: {
      companyName: "",
      domain: "",
      websiteUrl: "",
      linkedinUrl: "",
      industry: "",
      city: "",
      country: "",
      timezone: "UTC",
    },
  })

  const createOrgMutation = trpc.auth.createOrganization.useMutation()

  const handleSetupOrg = async (data: SetupOrgInput) => {
    setMessage(null)
    try {
      const res = await createOrgMutation.mutateAsync({
        companyName: data.companyName.trim(),
        domain: data.domain?.trim() || undefined,
        websiteUrl: data.websiteUrl?.trim() || undefined,
        linkedinUrl: data.linkedinUrl?.trim() || undefined,
        industry: data.industry?.trim() || undefined,
        city: data.city?.trim() || undefined,
        country: data.country?.trim() || undefined,
        timezone: data.timezone || "UTC",
      })

      setMessage({ type: "success", text: res.message })
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create organization." })
    }
  }

  return {
    form,
    handleSetupOrg,
    loading: form.formState.isSubmitting || createOrgMutation.isPending,
    message,
    setMessage,
  }
}
