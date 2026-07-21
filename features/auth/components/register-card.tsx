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

export function RegisterCard() {
  const {
    step,
    userType,
    candidateForm,
    employeeForm,
    handleSelectUserType,
    handleNextStep,
    handleBackToStep1,
    handleBackToStep0,
    handleCandidateRegister,
    handleEmployeeRegister,
    loading,
    message,
  } = useRegisterForm()

  return (
    <Card className="w-full border-border bg-card relative shadow-md">
      <CardHeader className="text-center space-y-1 relative">
        {step === 1 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBackToStep0}
            className="absolute left-4 top-0 rounded-full h-9 w-9 shadow-sm"
            aria-label="Back to step 0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
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
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          {step === 0 ? "Get Started with Dev-Center" : "Sign up"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step === 0
            ? "Select how you want to use Dev-Center."
            : step === 1
            ? "Enter your email to continue."
            : "Complete your details to finish creating account."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Message */}
        {message && <AlertMessage message={message} />}

        {/* STEP 0: Intent Selection */}
        {step === 0 && <RegisterIntentStep onSelect={handleSelectUserType} />}

        {/* STEP 1: Email & Social Auth */}
        {step === 1 && (
          <RegisterEmailStep
            userType={userType}
            candidateForm={candidateForm}
            employeeForm={employeeForm}
            onNext={handleNextStep}
            loading={loading}
          />
        )}

        {/* STEP 2: Credentials Input */}
        {step === 2 && (
          <RegisterCredentialsStep
            userType={userType}
            candidateForm={candidateForm}
            employeeForm={employeeForm}
            onCandidateSubmit={handleCandidateRegister}
            onEmployeeSubmit={handleEmployeeRegister}
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
