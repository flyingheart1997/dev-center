"use client"

import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialAuthButtons } from "./social-auth-buttons"
import { RegisterUserInput } from "../schema/auth-schemas"


interface RegisterEmailStepProps {
  registerForm: UseFormReturn<RegisterUserInput>
  onNext: () => void
  loading: boolean
}

export function RegisterEmailStep({
  registerForm,
  onNext,
  loading,
}: RegisterEmailStepProps) {
  return (
    <div className="space-y-6">
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
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <Button type="button" onClick={onNext} disabled={loading} className="w-full h-11">
        {loading ? "Checking Email..." : "Continue"}
      </Button>

      {/* Reusable Multi-Provider Social Auth Buttons */}
      <SocialAuthButtons providers={["google", "github", "linkedin"]} />
    </div>
  )
}
