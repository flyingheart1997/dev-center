"use client"

import React from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Mail, RefreshCcw } from "lucide-react"
import { AlertMessage } from "./alert-message"

export function VerifyEmailCard() {
  const { loading, status, email: urlEmail, handleResend, isResending } = useVerifyEmail()
  const { data: session, status: sessionStatus } = useSession()

  const userEmail = urlEmail || session?.user?.email

  const onResendClick = () => {
    if (!userEmail) return
    handleResend(userEmail)
  }

  return (
    <Card className="w-full text-center">
      <CardHeader className="space-y-3 pt-4">
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

        {userEmail && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onResendClick}
            disabled={isResending}
          >
            {isResending ? <Spinner className="w-4 h-4 mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
            Resend Verification Email
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        {sessionStatus === "authenticated" &&
          <div className="text-sm text-center text-muted-foreground flex items-center justify-center gap-1">
            Not you?
            <Button variant="link" onClick={() => signOut({ callbackUrl: "/login" })} className="text-primary font-semibold hover:underline p-0 h-auto">
              Sign out
            </Button>
          </div>
        }
        {sessionStatus !== "authenticated" &&
          <p className="text-sm text-center text-muted-foreground">
            Back to{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        }

        <p className="text-xs text-center text-muted-foreground">
          © Dev-Center · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
