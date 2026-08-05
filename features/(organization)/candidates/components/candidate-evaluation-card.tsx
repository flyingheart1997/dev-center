"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, UserCheck } from "lucide-react"
import { CandidateDetailModal } from "./candidate-detail-modal"
import { CandidateAvatarHeader } from "./candidate-avatar-header"
import { CandidateStatusBadge } from "./candidate-status-badge"

export interface CandidateEvaluationData {
  id: string
  candidateName: string
  candidateEmail: string | null
  candidatePhone?: string | null
  candidateLocation?: string | null
  candidateImage?: string | null
  jobTitle: string
  departmentName?: string
  status: string
  screeningScore?: number | null
  createdAt: string
}

interface CandidateEvaluationCardProps {
  candidate?: CandidateEvaluationData
  isLoading?: boolean
  showHoverOverlay?: boolean
}

function getCandidateATSSteps(status: string): { steps: TimelineStepItem[]; activeIndex: number } {
  const normalized = status.toLowerCase()

  let activeIndex = 1
  if (normalized.includes("interview") || normalized.includes("technical")) activeIndex = 3
  else if (normalized.includes("review")) activeIndex = 2
  else if (normalized.includes("passed") || normalized.includes("ai") || normalized.includes("screening")) activeIndex = 1
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

export function CandidateEvaluationCard({
  candidate,
  isLoading = false,
  showHoverOverlay = true,
}: CandidateEvaluationCardProps) {
  // Detailed Integrated Skeleton State
  if (isLoading || !candidate) {
    return (
      <div className="p-3.5 rounded-lg border border-border bg-card space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-md mt-1" />
      </div>
    )
  }

  const { steps, activeIndex } = getCandidateATSSteps(candidate.status)

  return (
    <div className="relative group p-3.5 rounded-lg border border-border bg-card space-y-3 hover:border-primary/40 hover:shadow-xs transition-all overflow-hidden">
      {/* Header Row: Candidate Info (Left) + AI Score & Status (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <CandidateAvatarHeader
          name={candidate.candidateName}
          email={candidate.candidateEmail}
          image={candidate.candidateImage}
          jobTitle={candidate.jobTitle}
          departmentName={candidate.departmentName}
          appliedDate={candidate.createdAt}
        />

        {/* Top-Right Badges <-> Button Swap Container */}
        <div className="relative shrink-0 self-center sm:ml-auto flex items-center justify-end">
          <div className="flex items-center gap-2 transition-all duration-200 group-hover:opacity-0 group-hover:scale-95 group-hover:pointer-events-none">
            <CandidateStatusBadge
              status={candidate.status}
              screeningScore={candidate.screeningScore}
            />
          </div>

          {showHoverOverlay && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto flex items-center">
              <CandidateDetailModal applicationId={candidate.id} candidateData={candidate}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs font-semibold bg-background hover:bg-muted shadow-xs gap-1 border-primary/40"
                >
                  <UserCheck className="w-3.5 h-3.5 text-primary" /> View Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </CandidateDetailModal>
            </div>
          )}
        </div>
      </div>

      {/* Shared Interactive Step Timeline Bar */}
      <StepTimeline steps={steps} activeStepIndex={activeIndex} accentColor="purple" />
    </div>
  )
}
