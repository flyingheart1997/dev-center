"use client"

import React from "react"
import Link from "next/link"
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Mail } from "lucide-react"
import { AlertMessage } from "./alert-message"

export function VerifyEmailCard() {
  const { loading, status } = useVerifyEmail()

  return (
    <Card className="w-full text-center">
      <CardHeader className="space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            <Spinner className="w-4 h-4" />
            <span>Verifying your email token...</span>
          </div>
        )}

        {status && <AlertMessage message={status} />}
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-center text-muted-foreground">
          Back to{" "}
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
