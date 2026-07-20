"use client"

import React from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock } from "lucide-react"

export function PendingApprovalCard() {
  return (
    <Card className="w-full text-center border-slate-200 dark:border-slate-800">
      <CardHeader className="space-y-2">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Clock className="w-7 h-7" />
        </div>
        <CardTitle className="text-2xl font-bold">Account Pending Approval</CardTitle>
        <CardDescription>
          Your employee account has been created and is currently awaiting approval from your Organization Administrator.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Alert className="text-left bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
          <AlertTitle className="font-semibold text-amber-800 dark:text-amber-300">
            What happens next?
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-700 dark:text-amber-400 space-y-1 mt-1">
            <ul className="list-disc pl-4 space-y-1">
              <li>An Organization Admin has received your access request.</li>
              <li>Once approved, you will get full access to the hiring dashboard.</li>
              <li>You can refresh this page or log in again once approved.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-border pt-4">
        <Button onClick={() => window.location.reload()} className="w-full h-11">
          Check Status / Refresh
        </Button>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-xs"
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}
