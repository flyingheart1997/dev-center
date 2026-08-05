"use client"

import * as React from "react"
import {
  CandidateEvaluationCard,
  CandidateEvaluationData,
} from "@/features/(organization)/candidates/components/candidate-evaluation-card"
import { TimelineNodeStep } from "./dashboard-timeline-nodes"
import { cn } from "@/lib/utils"

export interface CandidateEvaluationRowProps {
  name: string
  email: string
  role: string
  department: string
  appliedDate: string
  aiScore: number
  statusBadge: string
  statusVariant?: "purple" | "emerald" | "default"
  steps: TimelineNodeStep[]
  className?: string
}

export function CandidateEvaluationRowCard({
  name,
  email,
  role,
  department,
  appliedDate,
  aiScore,
  statusBadge,
  className,
}: CandidateEvaluationRowProps) {
  const candidateData: CandidateEvaluationData = {
    id: `demo-${name.toLowerCase().replace(/\s+/g, "-")}`,
    candidateName: name,
    candidateEmail: email,
    jobTitle: role,
    departmentName: department,
    status: statusBadge,
    screeningScore: aiScore,
    createdAt: appliedDate,
  }

  return (
    <div className={cn(className)}>
      <CandidateEvaluationCard candidate={candidateData} showHoverOverlay={true} />
    </div>
  )
}
