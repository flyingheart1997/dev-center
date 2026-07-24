"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRegisterForm } from "@/features/auth/hooks/use-register-form"
import { AlertMessage } from "./alert-message"
import { RegisterIntentStep } from "./register-intent-step"
import { RegisterEmailStep } from "./register-email-step"
import { RegisterCredentialsStep } from "./register-credentials-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const STEP_DESCRIPTIONS: Record<number, string> = {
  0: "How do you want to use Dev Center?",
  1: "Join Dev Center for AI-powered screening, live interviews, and candidate management.",
  2: "Enter your full name and set a secure password to complete setting up your account.",
}

export function RegisterCard() {
  const {
    step,
    intent,
    setIntent,
    inviteDetails,
    registerForm,
    handleIntentContinue,
    handleNextStep,
    handleBackStep,
    handleRegister,
    loading,
    message,
  } = useRegisterForm()

  return (
    <Card className="w-full border-border bg-card relative shadow-md">
      <CardHeader className="text-center space-y-2 pt-4 relative">
        {step > 0 && !inviteDetails && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBackStep}
            className="absolute left-3 -top-1 rounded-full h-9 w-9 shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
          Create your {intent === 'organization' ? 'Organization' : 'Account'}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {STEP_DESCRIPTIONS[step]}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && <AlertMessage message={message} />}

        {step === 0 && (
          <RegisterIntentStep intent={intent} onSelect={setIntent} onContinue={handleIntentContinue} />
        )}

        {step === 1 && intent && (
          <RegisterEmailStep
            registerForm={registerForm}
            intent={intent}
            onNext={handleNextStep}
            loading={loading}
            inviteDetails={inviteDetails}
            emailLocked={!!inviteDetails}
          />
        )}

        {step === 2 && (
          <RegisterCredentialsStep
            registerForm={registerForm}
            onSubmit={handleRegister}
            loading={loading}
          />
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
