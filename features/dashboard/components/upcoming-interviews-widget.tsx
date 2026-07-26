"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, ArrowRight, Calendar } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { InterviewCardItem } from "./interview-card-item"

export interface UpcomingInterviewItem {
  id: string
  candidateName: string
  candidateEmail?: string | null
  jobTitle: string
  roundTitle: string
  interviewerName?: string
  interviewerRole?: string
  startTime: string
  endTime: string
  meetingLink?: string | null
  livekitRoomId?: string | null
}

interface UpcomingInterviewsWidgetProps {
  interviews: UpcomingInterviewItem[]
  isInterviewerOnly?: boolean
  isLoading?: boolean
}

export function UpcomingInterviewsWidget({
  interviews,
  isInterviewerOnly = false,
  isLoading = false,
}: UpcomingInterviewsWidgetProps) {
  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold flex items-center gap-2 min-w-0">
            <Video className="h-5 w-5 text-purple-500 shrink-0" />
            <Tooltip side="top" content="Scheduled Live Interviews">
              <span className="w-fit max-w-full inline-block truncate">
                Scheduled Live Interviews
              </span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="min-w-0 mt-0.5">
            <Tooltip side="top" content="Direct access to collaborative video meeting rooms">
              <span className="w-fit max-w-full inline-block truncate text-xs text-muted-foreground">
                Direct access to collaborative video meeting rooms
              </span>
            </Tooltip>
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3">
          <Link href="/interviews">
            View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No upcoming interviews scheduled</p>
            <p className="text-xs text-muted-foreground mt-0.5">Interviews scheduled with candidates will appear here.</p>
          </div>
        ) : (
          interviews.map((item) => {
            const startTimeFormatted = new Date(item.startTime).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <InterviewCardItem
                key={item.id}
                id={item.id}
                candidateName={item.candidateName}
                jobTitle={item.jobTitle}
                roundTitle={item.roundTitle}
                timeText={startTimeFormatted}
                interviewerName={item.interviewerName}
                interviewerRole={item.interviewerRole}
                isInterviewerOnly={isInterviewerOnly}
                accentColor="purple"
                actionButton={
                  <Button size="xs" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white shrink-0" asChild>
                    <Link href={`/interview/${item.id}`}>
                      <Video className="mr-1.5 h-3 w-3" />
                      Join Room
                    </Link>
                  </Button>
                }
              />
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
