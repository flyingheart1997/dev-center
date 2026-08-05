"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import { Mail, Sparkles, ArrowUpRight, UserCheck } from "lucide-react"
import { CandidateDetailModal } from "./candidate-detail-modal"

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
  // 1. Detailed Integrated Skeleton State
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
  const initials = candidate.candidateName
    ? candidate.candidateName.substring(0, 2).toUpperCase()
    : "CD"

  const formattedDate = candidate.createdAt
    ? new Date(candidate.createdAt).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "Recently"

  return (
    <div className="relative group p-3.5 rounded-lg border border-border bg-card space-y-3 hover:border-primary/40 hover:shadow-xs transition-all overflow-hidden">
      {/* Header Row: Candidate Info (Left) + AI Score & Status (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        {/* Left: Avatar + Candidate Info & Job Specs */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 border border-border shrink-0">
            <AvatarImage src={candidate.candidateImage || undefined} alt={candidate.candidateName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
            {/* Candidate Name & Email */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
              <Tooltip content={candidate.candidateName}>
                <span className="font-semibold text-sm text-foreground truncate">
                  {candidate.candidateName}
                </span>
              </Tooltip>

              {candidate.candidateEmail && (
                <Tooltip content={candidate.candidateEmail}>
                  <span className="text-xs text-muted-foreground font-normal flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{candidate.candidateEmail}</span>
                  </span>
                </Tooltip>
              )}
            </div>

            {/* Job Title, Department & Applied Date */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground min-w-0">
              <Tooltip content={candidate.jobTitle}>
                <span className="font-medium text-foreground/90 truncate max-w-50">
                  {candidate.jobTitle}
                </span>
              </Tooltip>

              {candidate.departmentName && (
                <div className="items-center gap-2 hidden sm:flex">
                  <span>•</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
                    {candidate.departmentName}
                  </Badge>
                </div>
              )}

              <span>•</span>
              <span className="shrink-0">Applied {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Top-Right Badges: AI Score & Status */}
        {/* Top-Right Badges <-> Button Swap Container */}
        <div className="relative shrink-0 self-center sm:ml-auto flex items-center justify-end">
          <div className="flex items-center gap-2 transition-all duration-200 group-hover:opacity-0 group-hover:scale-95 group-hover:pointer-events-none">
            {candidate.screeningScore !== null && candidate.screeningScore !== undefined && (
              <Badge
                variant="outline"
                className="py-1 px-3 text-xs font-normal bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-3 w-3 mr-1" /> AI Score: {candidate.screeningScore}%
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="capitalize py-1 px-3 text-xs font-normal bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 whitespace-nowrap shrink-0"
            >
              {candidate.status}
            </Badge>
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
