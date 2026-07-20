"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, GraduationCap } from "lucide-react"

export function OnboardingCard() {
  return (
    <Card className="w-full border-slate-200 dark:border-slate-800">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">Choose Your Workspace</CardTitle>
        <CardDescription>How would you like to use Dev-Center today?</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Card 1: B2B Employer */}
        <Link
          href="/register?type=employee"
          className="group block p-4 border border-border rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                I Want to Hire Talent (Employer)
              </h3>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                B2B Enterprise SaaS
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create or join your company workspace, manage multi-branch recruitment, run AI screening, and conduct live interview rooms.
          </p>
        </Link>

        {/* Card 2: B2C Candidate */}
        <Link
          href="/register?type=candidate"
          className="group block p-4 border border-border rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                I Am a Job Seeker / AI Prep User
              </h3>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                B2C Candidate Studio
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Practice 1-on-1 AI voice mock interviews, optimize your resume for ATS match scores, solve coding challenges, and apply to top jobs.
          </p>
        </Link>
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
