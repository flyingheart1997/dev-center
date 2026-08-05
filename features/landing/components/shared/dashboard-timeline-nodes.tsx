"use client"

import * as React from "react"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"

export interface TimelineNodeStep {
  id: number
  label: string
  isCompleted?: boolean
  isActive?: boolean
  subRounds?: number
}

interface DashboardTimelineNodesProps {
  steps: TimelineNodeStep[]
  accentColor?: "purple" | "amber" | "emerald"
  className?: string
}

export function DashboardTimelineNodes({
  steps,
  accentColor = "purple",
  className,
}: DashboardTimelineNodesProps) {
  const activeStep = steps.find((s) => s.isActive)
  const activeStepIndex = activeStep ? activeStep.id : 1

  const mappedSteps: TimelineStepItem[] = steps.map((s) => ({
    id: s.id,
    label: s.label,
    subSteps: s.subRounds
      ? Array.from({ length: s.subRounds }, (_, i) => ({
          id: i + 1,
          label: `Round ${i + 1}`,
          isCompleted: i === 0,
          isCurrentActive: i === 1,
        }))
      : undefined,
  }))

  return (
    <StepTimeline
      steps={mappedSteps}
      activeStepIndex={activeStepIndex}
      accentColor={accentColor}
      className={className}
    />
  )
}
