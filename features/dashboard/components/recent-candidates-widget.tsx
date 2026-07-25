import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Users, UserCheck } from "lucide-react"

export interface CandidateEvaluationItem {
  id: string
  candidateName: string
  candidateEmail: string | null
  jobTitle: string
  status: string
  screeningScore?: number | null
  createdAt: string
}

interface RecentCandidatesWidgetProps {
  candidates: CandidateEvaluationItem[]
}

export function RecentCandidatesWidget({ candidates }: RecentCandidatesWidgetProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-500" />
            Recent Candidate Evaluations
          </CardTitle>
          <CardDescription>Latest candidates processed by AI Voice & Coding virtual compiler</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/candidates">
            View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Candidate Evaluations</p>
            <p className="text-xs text-muted-foreground">Applications will appear here as candidates submit resumes and take AI pre-screenings.</p>
          </div>
        ) : (
          candidates.map((cand) => (
            <div key={cand.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">{cand.candidateName}</span>
                <span className="text-xs text-muted-foreground">{cand.jobTitle}</span>
              </div>
              <div className="flex items-center gap-3">
                {cand.screeningScore !== null && cand.screeningScore !== undefined && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    AI Score: {cand.screeningScore}%
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize text-xs">
                  {cand.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
