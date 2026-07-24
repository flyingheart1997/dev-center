"use client"

import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialAuthButtons } from "./social-auth-buttons"
import { RegisterUserInput } from "../schema/auth-schemas"
import { RegisterIntent } from "./register-intent-step"

interface InviteDetails {
  organizationName: string
  role: string
}

interface RegisterEmailStepProps {
  registerForm: UseFormReturn<RegisterUserInput>
  intent: RegisterIntent
  onNext: () => void
  loading: boolean
  inviteDetails?: InviteDetails | null
  emailLocked?: boolean
}

export function RegisterEmailStep({
  registerForm,
  intent,
  onNext,
  loading,
  inviteDetails,
  emailLocked = false,
}: RegisterEmailStepProps) {
  const nameValue = registerForm.watch("name")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="step1-name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <Controller
            name="name"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="step1-name"
                  placeholder="John Doe"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="step1-email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <Controller
            name="email"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="step1-email"
                  type="email"
                  placeholder="hello@app.com"
                  className="h-11"
                  disabled={emailLocked}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      <Button type="button" onClick={onNext} disabled={loading} className="w-full h-11">
        {loading ? "Checking Email..." : "Continue"}
      </Button>

      {!inviteDetails && (
        <SocialAuthButtons
          providers={["google", "github", "linkedin"]}
          mode="register"
          intent={intent}
          disabled={!nameValue?.trim()}
        />
      )}
    </div>
  )
}
