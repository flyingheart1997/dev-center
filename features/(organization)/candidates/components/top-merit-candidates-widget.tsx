import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Trophy, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { CandidateDetailModal } from "./candidate-detail-modal"
import { CandidateAvatarHeader } from "./candidate-avatar-header"
import { CandidateStatusBadge } from "./candidate-status-badge"

interface TopMeritCandidatesWidgetProps {
  candidates?: Array<{
    id: string
    job: { title: string; department?: { name: string } | null }
    candidate: {
      id: string
      experienceYears: number | null
      currentDesignation: string | null
      user?: {
        name: string | null
        email: string | null
        image: string | null
        location: string | null
      } | null
      skills: Array<{ skill: { name: string } }>
    }
    screeningResult?: {
      overallScore: number | null
      recommendation: string | null
    } | null
  }>
  isLoading?: boolean
}

export function TopMeritCandidatesWidget({
  candidates = [],
  isLoading = false,
}: TopMeritCandidatesWidgetProps) {
  const filteredCandidates = candidates.filter(
    (app) => (app.screeningResult?.overallScore ?? 0) >= 80
  )

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="border-b border-border/50 py-3 shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <Tooltip content="Top Merit Leaderboard">
              <CardTitle className="text-base font-bold flex items-center gap-2 min-w-0 truncate">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="truncate min-w-0">Top Merit Leaderboard</span>
              </CardTitle>
            </Tooltip>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0"
          >
            Score ≥ 80%
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          Candidates with top AI pre-screening evaluations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No candidates with score ≥ 80% recorded yet.
          </div>
        ) : (
          filteredCandidates.map((app, rank) => {
            const userName = app.candidate.user?.name || app.candidate.user?.email || "Candidate"
            const score = app.screeningResult?.overallScore ?? null

            return (
              <div
                key={app.id}
                className="p-3 rounded-lg border border-border/80 bg-card hover:bg-accent/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="relative flex items-center min-w-0 flex-1">
                  <span className="absolute -top-1 -left-1 z-10 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {rank + 1}
                  </span>

                  <CandidateAvatarHeader
                    name={userName}
                    email={app.candidate.user?.email}
                    image={app.candidate.user?.image}
                    jobTitle={app.job.title}
                    departmentName={app.job.department?.name || undefined}
                  />
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {score !== null && (
                    <CandidateStatusBadge
                      status="Top Merit"
                      screeningScore={score}
                    />
                  )}

                  <CandidateDetailModal applicationId={app.id}>
                    <Tooltip content={`View detailed evaluation profile for ${userName}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] px-2 font-semibold text-primary hover:text-primary/80"
                      >
                        Profile <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Tooltip>
                  </CandidateDetailModal>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
