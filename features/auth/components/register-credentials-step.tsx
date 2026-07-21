"use client"

import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { RegisterUserInput } from "../schema/auth-schemas"

interface RegisterCredentialsStepProps {
  registerForm: UseFormReturn<RegisterUserInput>
  onSubmit: (data: RegisterUserInput) => void
  loading: boolean
}

export function RegisterCredentialsStep({
  registerForm,
  onSubmit,
  loading,
}: RegisterCredentialsStepProps) {
  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let pass = "aZ1!" // guarantee required characters
    for (let i = 4; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('')
  }
  
  return (
    <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cand-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <Controller
          name="email"
          control={registerForm.control}
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
          control={registerForm.control}
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
          control={registerForm.control}
          render={({ field, fieldState }) => (
            <div>
              <PasswordInput
                {...field}
                id="cand-password"
                placeholder="Minimum 8 characters"
                className="h-11"
                aria-invalid={fieldState.invalid}
                onGenerate={() => {
                  const pwd = generateStrongPassword()
                  registerForm.setValue("password", pwd, { shouldValidate: true })
                  registerForm.setValue("confirmPassword", pwd, { shouldValidate: true })
                }}
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
          control={registerForm.control}
          render={({ field, fieldState }) => (
            <div>
              <PasswordInput
                {...field}
                id="cand-confirm-password"
                placeholder="Re-enter password"
                className="h-11"
                aria-invalid={fieldState.invalid}
                preventPaste={true}
                preventCopy={true}
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
