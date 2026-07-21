"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRegisterForm } from "@/features/auth/hooks/use-register-form"
import { AlertMessage } from "./alert-message"
import { RegisterEmailStep } from "./register-email-step"
import { RegisterCredentialsStep } from "./register-credentials-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterCard() {
  const {
    step,
    registerForm,
    handleNextStep,
    handleBackToStep1,
    handleRegister,
    loading,
    message,
  } = useRegisterForm()

  return (
    <Card className="w-full border-border bg-card relative shadow-md">
      <CardHeader className="text-center space-y-2 pt-4 relative">
        {step === 2 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBackToStep1}
            className="absolute left-4 top-2 rounded-full h-9 w-9 shadow-sm"
            aria-label="Back to step 1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
          Create your Account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {step === 1
            ? "Join Dev Center for AI-powered screening, live interviews, and candidate management."
            : "Enter your full name and set a secure password to complete setting up your account."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Message */}
        {message && <AlertMessage message={message} />}

        {/* STEP 1: Email & Social Auth */}
        {step === 1 && (
          <RegisterEmailStep
            registerForm={registerForm}
            onNext={handleNextStep}
            loading={loading}
          />
        )}

        {/* STEP 2: Credentials Input */}
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
