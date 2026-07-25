"use client"

import React, { Fragment } from "react"
import { Controller, Control } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialAuthButtons } from "./social-auth-buttons"
import { useLoginForm } from "@/features/auth/hooks/use-login-form"

interface LoginEmailStepProps {
  formState: ReturnType<typeof useLoginForm>
}

export function LoginEmailStep({ formState }: LoginEmailStepProps) {
  const {
    loginMethod,
    passwordForm,
    otpForm,
    handleContinueToStep2,
    loading,
  } = formState

  const activeControl = (loginMethod === "password" ? passwordForm.control : otpForm.control) as Control<any>

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="step1-login-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <Controller
          name="email"
          control={activeControl}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                id="step1-login-email"
                type="email"
                placeholder="hello@app.com"
                className="h-11"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="button"
        onClick={handleContinueToStep2}
        disabled={loading}
        className="w-full h-11"
      >
        {loading ? (
          <Fragment>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </Fragment>
        ) : (
          "Continue"
        )}
      </Button>

      <SocialAuthButtons providers={["google", "github", "linkedin"]} mode="login" />
    </div>
  )
}
