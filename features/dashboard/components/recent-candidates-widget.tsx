import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Users, UserCheck } from "lucide-react"
import { CandidateEvaluationCard, CandidateEvaluationData } from "@/features/(organization)/candidates/components/candidate-evaluation-card"
import { ApplicantStatus } from "@/types/enums"

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
  candidates?: CandidateEvaluationItem[]
  isLoading?: boolean
}

const fallbackRecentCandidates: CandidateEvaluationItem[] = [
  {
    id: "demo-1",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@example.com",
    jobTitle: "Senior Full-Stack Engineer",
    departmentName: "Engineering",
    status: ApplicantStatus.INTERVIEWING,
    screeningScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    candidateName: "Priya Patel",
    candidateEmail: "priya.p@example.com",
    jobTitle: "Frontend Developer (React 19)",
    departmentName: "Product Design",
    status: ApplicantStatus.OFFER,
    screeningScore: 88,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    candidateName: "Rohan Verma",
    candidateEmail: "rohan.verma@example.com",
    jobTitle: "Backend Microservices Architect",
    departmentName: "Engineering",
    status: ApplicantStatus.SCREENING,
    screeningScore: 78,
    createdAt: new Date().toISOString(),
  },
]

export function RecentCandidatesWidget({ candidates = [], isLoading = false }: RecentCandidatesWidgetProps) {
  const displayCandidates = candidates && candidates.length > 0 ? candidates : fallbackRecentCandidates

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

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <CandidateEvaluationCard isLoading={true} />
            <CandidateEvaluationCard isLoading={true} />
            <CandidateEvaluationCard isLoading={true} />
          </div>
        ) : displayCandidates.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Candidate Evaluations</p>
            <p className="text-xs text-muted-foreground">
              Applications will appear here as candidates submit resumes and take AI pre-screenings.
            </p>
          </div>
        ) : (
          displayCandidates.map((cand) => {
            const data: CandidateEvaluationData = {
              id: cand.id,
              candidateName: cand.candidateName,
              candidateEmail: cand.candidateEmail,
              jobTitle: cand.jobTitle,
              departmentName: cand.departmentName,
              status: cand.status,
              screeningScore: cand.screeningScore,
              createdAt: cand.createdAt,
            }

            return (
              <CandidateEvaluationCard
                key={cand.id}
                candidate={data}
              />
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
