"use client"

import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialAuthButtons } from "./social-auth-buttons"
import { CandidateRegisterInput, EmployeeRegisterInput } from "../schema/auth-schemas"

interface RegisterEmailStepProps {
  userType: "candidate" | "employee"
  candidateForm: UseFormReturn<CandidateRegisterInput>
  employeeForm: UseFormReturn<EmployeeRegisterInput>
  onNext: () => void
  loading: boolean
}

export function RegisterEmailStep({
  userType,
  candidateForm,
  employeeForm,
  onNext,
  loading,
}: RegisterEmailStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="step1-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        {userType === "candidate" ? (
          <Controller
            name="email"
            control={candidateForm.control}
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
        ) : (
          <Controller
            name="email"
            control={employeeForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="step1-email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        )}
      </div>

      <Button type="button" onClick={onNext} disabled={loading} className="w-full h-11">
        {loading ? "Checking Email..." : "Continue"}
      </Button>

      {/* Reusable Multi-Provider Social Auth Buttons */}
      <SocialAuthButtons providers={["google", "github", "linkedin"]} />
    </div>
  )
}
