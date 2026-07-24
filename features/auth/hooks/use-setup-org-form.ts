"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { trpc } from "@/lib/trpc/client"
import { setupOrgSchema, SetupOrgInput } from "../schema/auth-schemas"

export function useSetupOrgForm() {
  const router = useRouter()
  const { data: session, update } = useSession()
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

  // Prefill the domain from the user's own email once the session loads, without
  // clobbering a value the user has already typed or edited.
  useEffect(() => {
    const email = session?.user?.email
    if (!email || form.getValues("domain")) return
    const domain = email.split("@")[1]
    if (domain) form.setValue("domain", domain)
  }, [session?.user?.email, form])

  const createOrgMutation = trpc.auth.createOrganization.useMutation()

  const handleSetupOrg = async (data: SetupOrgInput) => {
    setMessage(null)
    try {
      const res = await createOrgMutation.mutateAsync({
        companyName: data.companyName.trim(),
        domain: data.domain.trim(),
        websiteUrl: data.websiteUrl?.trim() || undefined,
        linkedinUrl: data.linkedinUrl?.trim() || undefined,
        industry: data.industry?.trim() || undefined,
        city: data.city?.trim() || undefined,
        country: data.country?.trim() || undefined,
        timezone: data.timezone || "UTC",
      })

      setMessage({ type: "success", text: res.message })

      // Force the jwt callback to drop its cached (pre-Employee) user and re-read from the
      // DB, so the refreshed session cookie actually reflects the org/employee just created.
      await update()

      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 2000)
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
