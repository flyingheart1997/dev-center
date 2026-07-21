"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLoginForm } from "@/features/auth/hooks/use-login-form"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginEmailStep } from "./login-email-step"
import { LoginMethodsStep } from "./login-methods-step"

export function LoginCard() {
  const formState = useLoginForm()
  const { step, message, handleBackToStep1 } = formState

  return (
    <Card className="w-full border-border bg-card relative">
      <CardHeader className="text-center space-y-1 pt-4 relative">
        {step === 2 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBackToStep1}
            className="absolute left-4 top-0 rounded-full h-9 w-9 shadow-sm"
            aria-label="Back to step 1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Sign in</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step === 1 ? "Sign in to access your workspace, manage your activities, and pick up right where you left off." : "Choose your preferred sign-in method."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Message */}
        {message && <AlertMessage message={message} />}

        {/* STEP 1: Email + Social Auth */}
        {step === 1 && <LoginEmailStep formState={formState} />}

        {/* STEP 2: Password vs OTP Methods */}
        {step === 2 && <LoginMethodsStep formState={formState} />}
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
