"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import { FileEdit, CheckCircle2 } from "lucide-react"
import { InterviewCardItem } from "./interview-card-item"

export interface PendingScorecardItem {
  id: string
  candidateName: string
  jobTitle?: string
  roundTitle: string
  interviewerName: string
  interviewerRole?: string
  completedAt: string
  interviewId: string
}

interface PendingScorecardsWidgetProps {
  scorecards: PendingScorecardItem[]
  isInterviewerOnly?: boolean
  isLoading?: boolean
}

export function PendingScorecardsWidget({
  scorecards,
  isInterviewerOnly = false,
  isLoading = false,
}: PendingScorecardsWidgetProps) {
  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold flex items-center gap-2 min-w-0">
            <FileEdit className="h-5 w-5 text-amber-500 shrink-0" />
            <Tooltip side="top" content="Pending Scorecards">
              <span className="w-fit max-w-full inline-block truncate">
                Pending Scorecards
              </span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="min-w-0 mt-0.5">
            <Tooltip side="top" content="LiveKit meeting feedback forms awaiting sign-off">
              <span className="w-fit max-w-full inline-block truncate text-xs text-muted-foreground">
                LiveKit meeting feedback forms awaiting sign-off
              </span>
            </Tooltip>
          </CardDescription>
        </div>
        {!isLoading && scorecards.length > 0 && (
          <Badge variant="secondary" className="text-xs shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 p-2.5 ml-3">
            {scorecards.length} Pending
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ) : scorecards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">All Scorecards Submitted!</p>
            <p className="text-xs text-muted-foreground mt-0.5">No pending interviewer evaluation forms.</p>
          </div>
        ) : (
          scorecards.map((item) => (
            <InterviewCardItem
              key={item.id}
              id={item.id}
              candidateName={item.candidateName}
              jobTitle={item.jobTitle}
              roundTitle={item.roundTitle}
              timeText={item.completedAt}
              interviewerName={item.interviewerName}
              interviewerRole={item.interviewerRole}
              isInterviewerOnly={isInterviewerOnly}
              accentColor="amber"
              actionButton={
                <Button size="xs" variant="outline" className="h-7 text-xs shrink-0 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10" asChild>
                  <Link href={`/interview/${item.interviewId}/scorecard`}>
                    <FileEdit className="mr-1.5 h-3 w-3" />
                    Fill Scorecard
                  </Link>
                </Button>
              }
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
