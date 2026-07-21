"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, ArrowRight, Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function OnboardingCard() {
  const router = useRouter()
  const [userType, setUserType] = useState<"candidate" | "employee" | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const onboardCandidateMutation = trpc.auth.onboardCandidate.useMutation()

  const handleContinue = async () => {
    if (!userType) return
    
    setMessage(null)

    if (userType === "candidate") {
      try {
        const res = await onboardCandidateMutation.mutateAsync()
        setMessage({ type: "success", text: res.message })
        setTimeout(() => {
          router.push("/candidate")
        }, 1000)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "Failed to complete onboarding." })
      }
    } else {
      // Employee / Organization
      router.push("/setup-org")
    }
  }

  return (
    <Card className="w-full border-border bg-card shadow-md">
      <CardHeader className="text-center space-y-1 pt-6">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome to Dev-Center
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          How do you want to use the platform?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && <AlertMessage message={message} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all hover:bg-accent/50",
              userType === "candidate"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted bg-transparent hover:border-border"
            )}
            onClick={() => setUserType("candidate")}
          >
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                userType === "candidate" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <User className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold leading-none tracking-tight">I am a Candidate</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Apply for jobs, track applications, and practice interviews.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all hover:bg-accent/50",
              userType === "employee"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted bg-transparent hover:border-border"
            )}
            onClick={() => setUserType("employee")}
          >
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                userType === "employee" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold leading-none tracking-tight">I am an Organization</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Post jobs, manage candidates, and conduct interviews.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!userType || onboardCandidateMutation.isPending}
          className="w-full h-11 text-base mt-2"
        >
          {onboardCandidateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
