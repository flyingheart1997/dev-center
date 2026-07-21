"use client"

import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CandidateRegisterInput, EmployeeRegisterInput } from "../schema/auth-schemas"

interface RegisterCredentialsStepProps {
  userType: "candidate" | "employee"
  candidateForm: UseFormReturn<CandidateRegisterInput>
  employeeForm: UseFormReturn<EmployeeRegisterInput>
  onCandidateSubmit: (data: CandidateRegisterInput) => void
  onEmployeeSubmit: (data: EmployeeRegisterInput) => void
  loading: boolean
}

export function RegisterCredentialsStep({
  userType,
  candidateForm,
  employeeForm,
  onCandidateSubmit,
  onEmployeeSubmit,
  loading,
}: RegisterCredentialsStepProps) {
  if (userType === "candidate") {
    return (
      <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cand-email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <Controller
            name="email"
            control={candidateForm.control}
            render={({ field }) => (
              <Input {...field} id="cand-email" type="email" disabled className="h-11 bg-muted text-muted-foreground" />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cand-name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <Controller
            name="name"
            control={candidateForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="cand-name"
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
          <Label htmlFor="cand-password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <Controller
            name="password"
            control={candidateForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="cand-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cand-confirm-password" className="text-sm font-medium text-foreground">
            Confirm Password
          </Label>
          <Controller
            name="confirmPassword"
            control={candidateForm.control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  id="cand-confirm-password"
                  type="password"
                  placeholder="Re-enter password"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-11">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="emp-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <Controller
          name="email"
          control={employeeForm.control}
          render={({ field }) => (
            <Input {...field} id="emp-email" type="email" disabled className="h-11 bg-muted text-muted-foreground" />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-name" className="text-sm font-medium text-foreground">
          Full Name
        </Label>
        <Controller
          name="name"
          control={employeeForm.control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                id="emp-name"
                placeholder="Jane Smith"
                className="h-11"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <Controller
          name="password"
          control={employeeForm.control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                id="emp-password"
                type="password"
                placeholder="Minimum 8 characters"
                className="h-11"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-confirm-password" className="text-sm font-medium text-foreground">
          Confirm Password
        </Label>
        <Controller
          name="confirmPassword"
          control={employeeForm.control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                id="emp-confirm-password"
                type="password"
                placeholder="Re-enter password"
                className="h-11"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11">
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
