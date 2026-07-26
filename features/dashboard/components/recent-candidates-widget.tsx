import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"
import { ArrowUpRight, Users, UserCheck, Mail } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"

export interface CandidateEvaluationItem {
  id: string
  candidateName: string
  candidateEmail: string | null
  jobTitle: string
  departmentName?: string
  status: string
  screeningScore?: number | null
  createdAt: string
}

interface RecentCandidatesWidgetProps {
  candidates: CandidateEvaluationItem[]
  isLoading?: boolean
}

function getCandidateATSSteps(status: string): { steps: TimelineStepItem[]; activeIndex: number } {
  const normalized = status.toLowerCase()

  let activeIndex = 1
  if (normalized.includes("interview") || normalized.includes("technical")) activeIndex = 3
  else if (normalized.includes("review")) activeIndex = 2
  else if (normalized.includes("passed") || normalized.includes("ai")) activeIndex = 1
  else if (normalized.includes("offer") || normalized.includes("hired")) activeIndex = 5

  const steps: TimelineStepItem[] = [
    { id: 1, label: "Pre-Screening & Applied" },
    { id: 2, label: "Recruiter Review" },
    {
      id: 3,
      label: "Interview Rounds",
      subSteps: [
        { id: 1, label: "Round 1: Voice & Code Pre-Screen", isCompleted: true },
        { id: 2, label: "Round 2: System Architecture", isCurrentActive: activeIndex === 3 },
        { id: 3, label: "Round 3: HR & Culture Fit" },
      ],
    },
    { id: 4, label: "Offer & Negotiation" },
    { id: 5, label: "Hired" },
  ]

  return { steps, activeIndex }
}

export function RecentCandidatesWidget({ candidates, isLoading = false }: RecentCandidatesWidgetProps) {
  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <Users className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="truncate">Recent Candidate Evaluations</span>
          </CardTitle>
          <CardDescription className="truncate">
            Latest candidate applications processed by AI Voice & Virtual Compiler
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3">
          <Link href="/candidates">
            View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Candidate Evaluations</p>
            <p className="text-xs text-muted-foreground">Applications will appear here as candidates submit resumes and take AI pre-screenings.</p>
          </div>
        ) : (
          candidates.map((cand) => {
            const { steps, activeIndex } = getCandidateATSSteps(cand.status)

            return (
              <div
                key={cand.id}
                className="p-3.5 rounded-lg border border-border bg-card space-y-3 hover:bg-accent/30 transition-colors"
              >
                {/* Candidate Header Row + Top Right AI Score & Status Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                  {/* Left: Candidate Info */}
                  <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap sm:flex-nowrap items-center sm:gap-2 min-w-0">
                      <Tooltip content={cand.candidateName}>
                        <span className="font-semibold text-sm text-foreground truncate">{cand.candidateName}</span>
                      </Tooltip>
                      {cand.candidateEmail && (
                        <Tooltip content={cand.candidateEmail}>
                          <span className="text-xs text-muted-foreground font-normal flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{cand.candidateEmail}</span>
                          </span>
                        </Tooltip>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground min-w-0 flex-1">
                      <Tooltip content={cand.jobTitle}>
                        <span className="font-medium text-foreground/90 truncate max-w-[40%] sm:max-w-[25%]">
                          {cand.jobTitle}
                        </span>
                      </Tooltip>
                      {cand.departmentName && (
                        <div className="items-center gap-2 hidden sm:flex">
                          <span>•</span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
                            {cand.departmentName}
                          </Badge>
                        </div>
                      )}
                      <span>•</span>
                      <span className="shrink-0">Applied {new Date(cand.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Top-Right Badges: AI Score & Status */}
                  <div className="flex items-center gap-2 shrink-0 self-center sm:ml-auto">
                    {cand.screeningScore !== null && cand.screeningScore !== undefined && (
                      <Badge
                        variant="outline"
                        className="py-1 px-3 text-xs font-normal bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap shrink-0"
                      >
                        AI Score: {cand.screeningScore}%
                      </Badge>
                    )}

                    <Badge
                      variant="secondary"
                      className="capitalize py-1 px-3 text-xs font-normal bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 whitespace-nowrap shrink-0"
                    >
                      {cand.status}
                    </Badge>
                  </div>
                </div>

                {/* Shared Interactive Timeline Bar with Click-to-Expand Sub-Steps */}
                <StepTimeline
                  steps={steps}
                  activeStepIndex={activeIndex}
                  accentColor="purple"
                />
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
