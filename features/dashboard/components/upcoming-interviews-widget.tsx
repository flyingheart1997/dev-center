import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, ArrowRight, Calendar } from "lucide-react"

export interface UpcomingInterviewItem {
  id: string
  candidateName: string
  candidateEmail?: string | null
  jobTitle: string
  roundTitle: string
  startTime: string
  endTime: string
  meetingLink?: string | null
  livekitRoomId?: string | null
}

interface UpcomingInterviewsWidgetProps {
  interviews: UpcomingInterviewItem[]
}

export function UpcomingInterviewsWidget({ interviews }: UpcomingInterviewsWidgetProps) {
  if (interviews.length === 0) {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-500" />
              Scheduled Live Interviews
            </CardTitle>
            <CardDescription>Upcoming 1-on-1 video call rooms</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/interviews">Full Calendar</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground">No upcoming interviews scheduled</p>
          <p className="text-xs text-muted-foreground mt-1">Interviews scheduled with candidates will appear here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-500" />
            Scheduled Live Interviews
          </CardTitle>
          <CardDescription>Direct access to collaborative video meeting rooms</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/interviews">
            View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {interviews.map((item) => {
          const startTimeFormatted = new Date(item.startTime).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors gap-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{item.candidateName}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.roundTitle}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">{item.jobTitle}</span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{startTimeFormatted}</span>
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white" asChild>
                  <Link href={`/interview/${item.id}`}>
                    <Video className="mr-1.5 h-3.5 w-3.5" />
                    Join Live Room
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
