"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import { Controller } from "react-hook-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useLoginForm } from "@/features/auth/hooks/use-login-form"
import { PasswordInput } from "@/components/ui/password-input"
import { SocialAuthButtons } from "./social-auth-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { AlertMessage } from "./alert-message"

export function LoginCard() {
  const {
    step,
    loginMethod,
    setLoginMethod,
    otpSent,
    loading,
    message,
    passwordForm,
    otpForm,
    handleContinueToStep2,
    handleBackToStep1,
    handlePasswordLogin,
    handleOtpLogin,
    handleSendOtp,
    otpSubmitButtonText,
    resendButtonText,
    isResendDisabled,
  } = useLoginForm()

  return (
    <Card className="w-full border-border bg-card relative">
      <CardHeader className="text-center space-y-1 pt-4 relative">
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
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Sign in</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step === 1 ? "Welcome back! Please sign in to continue." : "Choose your preferred sign-in method."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Message */}
        {message && <AlertMessage message={message} />}

        {/* STEP 1: Email + Social Auth Buttons */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Step 1 Email Field */}
            <div className="space-y-2">
              <Label htmlFor="step1-login-email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              {loginMethod === "password" && (
                <Controller
                  name="email"
                  control={passwordForm.control}
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
              )}

              {loginMethod === "otp" && (
                <Controller
                  name="email"
                  control={otpForm.control}
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
              )}
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

            {/* Reusable Multi-Provider Social Auth Buttons */}
            <SocialAuthButtons providers={["google", "github", "linkedin"]} />

          </div>
        )}

        {/* STEP 2: Password vs OTP Login Tabs */}
        {step === 2 && (
          <div>
            <Tabs
              value={loginMethod}
              onValueChange={(val) => setLoginMethod(val as "password" | "otp")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">6-Digit Email OTP</TabsTrigger>
              </TabsList>

              {/* Password Login Form */}
              <TabsContent value="password">
                <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="step2-login-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Controller
                      name="email"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <div>
                          <Input
                            {...field}
                            id="step2-login-email"
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Controller
                      name="password"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <div>
                          <PasswordInput className="h-11" placeholder="Enter your password" {...field} aria-invalid={fieldState.invalid} />
                          {fieldState.error && (
                            <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-11">
                    {loading ? (
                      <Fragment>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </Fragment>
                    ) : (
                      "Sign in with Password"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login Form */}
              <TabsContent value="otp">
                <form onSubmit={otpForm.handleSubmit(handleOtpLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="step2-otp-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Controller
                      name="email"
                      control={otpForm.control}
                      render={({ field, fieldState }) => (
                        <div>
                          <Input
                            {...field}
                            id="step2-otp-email"
                            type="email"
                            placeholder="hello@app.com"
                            disabled={otpSent || loading}
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

                  {otpSent && (
                    <div className="space-y-3 flex flex-col items-center">
                      <Label htmlFor="otp-code" className="self-start text-sm font-medium text-foreground">
                        Enter 6-Digit OTP Code
                      </Label>
                      <Controller
                        name="otpCode"
                        control={otpForm.control}
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col items-center w-full">
                            <InputOTP
                              maxLength={6}
                              value={field.value || ""}
                              onChange={field.onChange}
                              disabled={loading}
                              aria-invalid={fieldState.invalid}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                            {fieldState.error && (
                              <p className="text-xs text-destructive mt-1 text-center">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        disabled={isResendDisabled}
                        onClick={() => handleSendOtp(otpForm.getValues("email"))}
                        className="text-xs text-primary font-medium p-0 h-auto"
                      >
                        {resendButtonText}
                      </Button>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full h-11">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {otpSubmitButtonText}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
