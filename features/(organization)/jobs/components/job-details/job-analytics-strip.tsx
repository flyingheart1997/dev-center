"use client"

import * as React from "react"
import { Users, UserCheck, Video, CheckCircle2, TrendingUp, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobAnalyticsStrip() {
  const { job } = useJobDetails()

  if (!job) return null

  const applications = job.applications || []
  const roundsCount = job.rounds?.length || 0

  const totalApps = applications.length
  const screeningPassed = applications.filter(
    (app: any) => app.screeningResult && (app.screeningResult.overallScore || 0) >= 70
  ).length

  const interviewing = applications.filter(
    (app: any) => app.status === "Interviewing" || app.status === "Shortlisted"
  ).length

  const hired = applications.filter(
    (app: any) => app.status === "Hired" || app.status === "OfferAccepted"
  ).length

  // Calculate average AI screening score
  const scores = applications
    .map((app: any) => app.screeningResult?.overallScore || app.screeningScore)
    .filter((s: any): s is number => typeof s === "number" && s > 0)

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border border-border shadow-xs bg-linear-to-br from-card via-card to-blue-500/5 p-4">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">{totalApps}</span>
                <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <TrendingUp className="h-2.5 w-2.5" /> Total
                </Badge>
              </div>
              <span className="text-xs font-semibold text-foreground truncate mt-0.5">Total Applications</span>
              <span className="text-[10px] text-muted-foreground truncate font-normal">Candidate Submissions</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-border shadow-xs bg-linear-to-br from-card via-card to-emerald-500/5 p-4">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">{screeningPassed}</span>
                <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Avg: {avgScore}%
                </Badge>
              </div>
              <span className="text-xs font-semibold text-foreground truncate mt-0.5">AI Screened Passed</span>
              <span className="text-[10px] text-muted-foreground truncate font-normal">Merit Threshold ≥ 70%</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-border shadow-xs bg-linear-to-br from-card via-card to-purple-500/5 p-4">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Video className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">{interviewing}</span>
                <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-purple-500/10 text-purple-500 border-purple-500/20">
                  {roundsCount} Rounds
                </Badge>
              </div>
              <span className="text-xs font-semibold text-foreground truncate mt-0.5">Active Interviewing</span>
              <span className="text-[10px] text-muted-foreground truncate font-normal">Live Meeting Pipeline</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-border shadow-xs bg-linear-to-br from-card via-card to-amber-500/5 p-4">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">{hired}</span>
                <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Hired
                </Badge>
              </div>
              <span className="text-xs font-semibold text-foreground truncate mt-0.5">Hired & Onboarded</span>
              <span className="text-[10px] text-muted-foreground truncate font-normal">Signed Offer Acceptance</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
