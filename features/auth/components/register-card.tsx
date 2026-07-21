"use client"

import React from "react"
import Link from "next/link"
import { Controller } from "react-hook-form"
import { ArrowLeft } from "lucide-react"
import { useRegisterForm } from "@/features/auth/hooks/use-register-form"
import { AlertMessage } from "./alert-message"
import { SocialAuthButtons } from "./social-auth-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterCard() {
  const {
    step,
    userType,
    setUserType,
    candidateForm,
    employeeForm,
    handleNextStep,
    handleBackToStep1,
    handleCandidateRegister,
    handleEmployeeRegister,
    loading,
    message,
  } = useRegisterForm()

  return (
    <Card className="w-full border-border bg-card relative">
      <CardHeader className="text-center space-y-1 relative">
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
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">Sign up</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step === 1 ? "Join Dev-Center to start hiring or preparing with AI." : "Complete your details to finish creating account."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alert Message */}
        {message && <AlertMessage message={message} />}

        {/* STEP 1: Email + Social Buttons + Account Type */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Account Type Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Account Type</Label>
              <Tabs
                value={userType}
                onValueChange={(val) => setUserType(val as "candidate" | "employee")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="candidate">Job Seeker</TabsTrigger>
                  <TabsTrigger value="employee">Employer</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Step 1 Email Field */}
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

            <Button type="button" onClick={handleNextStep} className="w-full h-11">
              Continue
            </Button>


            {/* Reusable Multi-Provider Social Auth Buttons */}
            <SocialAuthButtons providers={["google", "github", "linkedin"]} />

          </div>
        )}

        {/* STEP 2: Profile Details & Passwords */}
        {step === 2 && (
          <div>
            {/* Candidate Registration Form */}
            {userType === "candidate" && (
              <form onSubmit={candidateForm.handleSubmit(handleCandidateRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cand-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Controller
                    name="email"
                    control={candidateForm.control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          id="cand-email"
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

                <div className="space-y-2">
                  <Label htmlFor="cand-phone" className="text-sm font-medium text-foreground">
                    Phone Number (Optional)
                  </Label>
                  <Controller
                    name="phone"
                    control={candidateForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        id="cand-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="h-11"
                      />
                    )}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}

            {userType === "employee" && (
              /* Employee Registration Form */
              <form onSubmit={employeeForm.handleSubmit(handleEmployeeRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emp-email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Controller
                    name="email"
                    control={employeeForm.control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          id="emp-email"
                          type="email"
                          placeholder="you@company.com"
                          className="h-11"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                      </div>
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
            )}
          </div>
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
          © Dev-Center · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
        </p>
      </CardFooter>
    </Card>
  )
}
