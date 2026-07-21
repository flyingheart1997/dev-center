"use client"

import React, { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, ArrowRight, Loader2, Lock, AlertCircle } from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { isPublicEmailDomain } from "@/features/auth/utils/domain-utils"

export function OnboardingCard() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [userType, setUserType] = useState<"candidate" | "employee" | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const onboardCandidateMutation = trpc.auth.onboardCandidate.useMutation()

  const userEmail = session?.user?.email || ""
  const isPublicDomain = isPublicEmailDomain(userEmail)

  const handleContinue = async () => {
    if (!userType) return

    setMessage(null)

    if (userType === "candidate") {
      try {
        const res = await onboardCandidateMutation.mutateAsync()
        setMessage({ type: "success", text: res.message })

        // Refresh NextAuth session JWT cookie with new Candidate ID
        await update()

        setTimeout(() => {
          router.push("/candidate")
          router.refresh()
        }, 2000)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "Failed to complete onboarding." })
      }
    } else {
      if (isPublicDomain) {
        setMessage({
          type: "error",
          text: "Organization setup requires a corporate/work email. Personal email domains cannot register an organization.",
        })
        return
      }
      // Employee / Organization
      router.push("/setup-org")
    }
  }

  return (
    <Card className="w-full border-border bg-card shadow-md">
      <CardHeader className="text-center space-y-1 pt-6">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome to Dev Center
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          How do you want to use the platform?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && <AlertMessage message={message} />}

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div
            className={cn(
              "relative flex cursor-pointer items-center justify-start gap-4 rounded-xl border-2 p-6 transition-all hover:bg-accent/50",
              userType === "candidate"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted bg-transparent hover:border-border"
            )}
            onClick={() => setUserType("candidate")}
          >
            <div
              className={cn(
                "rounded-full p-3 transition-colors shrink-0",
                userType === "candidate" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <User className="h-6 w-6" />
            </div>
            <div className="text-start">
              <h3 className="font-semibold leading-none tracking-tight">I am a Candidate</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Explore opportunities, monitor application progress, practice interviews, and land your next role with confidence.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 rounded-xl border-2 p-6 transition-all",
              isPublicDomain
                ? "opacity-60 bg-muted/30 border-muted cursor-not-allowed"
                : userType === "employee"
                  ? "border-primary bg-primary/5 shadow-sm cursor-pointer hover:bg-accent/50"
                  : "border-muted bg-transparent hover:border-border cursor-pointer hover:bg-accent/50"
            )}
            onClick={() => {
              if (!isPublicDomain) {
                setUserType("employee")
              }
            }}
          >
            <div
              className={cn(
                "rounded-full p-3 transition-colors shrink-0",
                userType === "employee" && !isPublicDomain
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-start flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold leading-none tracking-tight">Create an Organization</h3>
                {isPublicDomain && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 absolute top-2 right-2">
                    <Lock className="h-3 w-3" /> Work Email Required
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Create job postings, screen candidates with AI, schedule interviews, and streamline your hiring process.
              </p>
            </div>
          </div>
          {isPublicDomain && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center text-center gap-2">
                {/* <AlertCircle className="h-3.5 w-3.5 shrink-0 inline" /> */}
                Please use your company's work email to create an organization. Personal email addresses (such as gmail or yahoo) cannot be used.
              </p>
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!userType || onboardCandidateMutation.isPending}
          className="w-full h-11 text-base mt-2"
        >
          {onboardCandidateMutation.isPending ? (
            <Fragment>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </Fragment>
          ) : (
            <Fragment>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Fragment>
          )}
        </Button>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4 pb-6">
        <p className="text-sm text-center text-muted-foreground">
          Want to use a different account?{" "}
          <Button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer inline"
          >
            Sign out
          </Button>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <a href="/privacy" className="hover:underline">Privacy</a> · <a href="/terms" className="hover:underline">Terms</a>
        </p>
      </CardFooter>
    </Card>
  )
}
