"use client"

import React from "react"
import Link from "next/link"
import { Controller } from "react-hook-form"
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertMessage } from "./alert-message"

export function ForgotPasswordCard() {
  const { form, loading, message, handleSubmit } = useForgotPasswordForm()

  return (
    <Card className="w-full border-slate-200 dark:border-slate-800">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your account email to receive a password reset link</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {message && <AlertMessage message={message} />}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email Address</Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    {...field}
                    className="h-11"
                    id="forgot-email"
                    type="email"
                    placeholder="you@company.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? "Sending Link..." : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
        </p>
      </CardFooter>
    </Card>
  )
}
