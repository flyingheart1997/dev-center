"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import { Building2, User, ArrowRight, Loader2, Lock } from "lucide-react"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/features/auth/hooks/use-onboarding"
import { cn } from "@/lib/utils"

export function OnboardingCard() {
  const {
    userType,
    setUserType,
    isPublicDomain,
    message,
    handleContinue,
    handleSignOut,
    loading,
  } = useOnboarding()

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
                Please use your company's work email to create an organization. Personal email addresses (such as gmail or yahoo) cannot be used.
              </p>
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!userType || loading}
          className="w-full h-11 text-base mt-2"
        >
          {loading ? (
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
            variant="link"
            size="sm"
            onClick={handleSignOut}
            className="text-primary font-semibold hover:underline p-0 h-auto inline cursor-pointer"
          >
            Sign out
          </Button>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
