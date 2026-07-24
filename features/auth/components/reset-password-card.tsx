"use client"

import React from "react"
import Link from "next/link"
import { Controller } from "react-hook-form"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateStrongPassword } from "@/features/auth/utils/password-utils"

export function ResetPasswordCard() {
  const { email, token, form, loading, message, handleSubmit } = useResetPasswordForm()

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-1 pt-4">
        <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
        <CardDescription>
          Enter a new password for <span className="font-semibold">{email || "your account"}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {message && <AlertMessage message={message} />}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <PasswordInput
                    className="h-11"
                    {...field}
                    id="new-password"
                    placeholder="Minimum 8 characters"
                    aria-invalid={fieldState.invalid}
                    onGenerate={() => {
                      const pwd = generateStrongPassword()
                      form.setValue("newPassword", pwd, { shouldValidate: true })
                      form.setValue("confirmPassword", pwd, { shouldValidate: true })
                    }}
                  />
                  {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <PasswordInput className="h-11" {...field} id="confirm-password" placeholder="Re-enter new password" aria-invalid={fieldState.invalid} preventPaste={true} preventCopy={true} />
                  {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={loading || !token || !email} className="w-full h-11">
            {loading ? "Updating Password..." : "Update Password & Log In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-center text-muted-foreground">
          Back to{" "}
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
