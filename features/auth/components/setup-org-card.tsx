"use client"

import React from "react"
import { Controller } from "react-hook-form"
import { useSetupOrgForm } from "@/features/auth/hooks/use-setup-org-form"
import { AlertMessage } from "./alert-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SetupOrgCard() {
  const { form, handleSetupOrg, loading, message } = useSetupOrgForm()

  return (
    <Card className="w-full border-border bg-card relative shadow-md">
      <CardHeader className="text-center space-y-1 pt-4">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          Set Up Your Organization
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Create your company workspace, configure your company details, and start hiring in minutes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && <AlertMessage message={message} />}

        <form onSubmit={form.handleSubmit(handleSetupOrg)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-sm font-medium text-foreground">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    {...field}
                    id="org-name"
                    placeholder="Acme Global Inc."
                    className="h-11"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-domain" className="text-sm font-medium text-foreground">
                Corporate Domain (Optional)
              </Label>
              <Controller
                name="domain"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="org-domain"
                    placeholder="acme.com"
                    className="h-11"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-industry" className="text-sm font-medium text-foreground">
                Industry (Optional)
              </Label>
              <Controller
                name="industry"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="org-industry"
                    placeholder="Software / Healthcare"
                    className="h-11"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-website" className="text-sm font-medium text-foreground">
                Website URL (Optional)
              </Label>
              <Controller
                name="websiteUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      {...field}
                      id="org-website"
                      type="url"
                      placeholder="https://acme.com"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-linkedin" className="text-sm font-medium text-foreground">
                LinkedIn Page URL (Optional)
              </Label>
              <Controller
                name="linkedinUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      {...field}
                      id="org-linkedin"
                      type="url"
                      placeholder="https://linkedin.com/company/acme"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label htmlFor="hq-city" className="text-sm font-medium text-foreground">
                Headquarters City
              </Label>
              <Controller
                name="city"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="hq-city"
                    placeholder="San Francisco"
                    className="h-11"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hq-country" className="text-sm font-medium text-foreground">
                Headquarters Country
              </Label>
              <Controller
                name="country"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="hq-country"
                    placeholder="United States"
                    className="h-11"
                  />
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 mt-2">
            {loading ? "Creating Workspace..." : "Complete Organization Setup"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Your workspace is just getting started. You can always add branches, departments, and team members later.
        </p>
        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <a href="/privacy" className="hover:underline">Privacy</a> · <a href="/terms" className="hover:underline">Terms</a>
        </p>
      </CardFooter>
    </Card>
  )
}
