"use client"

import React, { useState } from "react"
import { CheckCircle2, Circle, ChevronDown, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineSubStep {
  id: number
  label: string
  isCompleted?: boolean
  isCurrentActive?: boolean
}

export interface TimelineStepItem {
  id: number
  label: string
  subSteps?: TimelineSubStep[]
}

interface StepTimelineProps {
  steps: TimelineStepItem[]
  activeStepIndex: number // 1-indexed stage/step number
  accentColor?: "purple" | "emerald" | "amber"
  className?: string
}

export function StepTimeline({
  steps,
  activeStepIndex,
  accentColor = "purple",
  className,
}: StepTimelineProps) {
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null)

  // Theme color utility maps
  const activeColorMap = {
    purple: {
      text: "text-purple-500 font-semibold",
      ping: "bg-purple-400",
      circle: "text-purple-500 fill-purple-500/20",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    amber: {
      text: "text-amber-500 font-semibold",
      ping: "bg-amber-400",
      circle: "text-amber-500 fill-amber-500/20",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    emerald: {
      text: "text-emerald-500 font-semibold",
      ping: "bg-emerald-400",
      circle: "text-emerald-500 fill-emerald-500/20",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  }

  const activeStyle = activeColorMap[accentColor]

  const expandedStep = steps.find((s) => s.id === expandedStepId)

  // If currently expanded into a sub-step timeline
  if (expandedStepId !== null && expandedStep && expandedStep.subSteps) {
    return (
      <div className={cn("flex items-center w-full gap-2 py-1 transition-all duration-300", className)}>
        {/* Back to Parent Button */}
        <button
          type="button"
          onClick={() => setExpandedStepId(null)}
          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-1 rounded transition-colors shrink-0"
        >
          <Undo2 className="h-3 w-3 text-primary" />
          <span>Back</span>
        </button>

        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-[11px] font-semibold text-foreground shrink-0 truncate max-w-30">
          {expandedStep.label}:
        </span>

        {/* Render Sub-Steps Timeline */}
        <div className="flex items-center w-full justify-between gap-1 overflow-x-auto no-scrollbar min-w-0 flex-1">
          {expandedStep.subSteps.map((sub, idx) => {
            const isLast = idx === expandedStep.subSteps!.length - 1

            return (
              <React.Fragment key={sub.id}>
                <div className="flex items-center gap-1.5 shrink-0">
                  {sub.isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : sub.isCurrentActive ? (
                    <div className="relative flex items-center justify-center h-3.5 w-3.5">
                      <span
                        className={cn("animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75", activeStyle.ping)}
                      />
                      <Circle className={cn("h-3 w-3 shrink-0", activeStyle.circle)} />
                    </div>
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                  )}

                  <span
                    className={cn(
                      "text-[11px] whitespace-nowrap font-medium",
                      sub.isCompleted && "text-foreground font-medium",
                      sub.isCurrentActive && activeStyle.text,
                      !sub.isCompleted && !sub.isCurrentActive && "text-muted-foreground/50"
                    )}
                  >
                    {sub.label}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 min-w-3 flex-1 rounded-full transition-colors",
                      sub.isCompleted ? "bg-emerald-500/80" : "bg-border"
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  // Parent Timeline Default View
  return (
    <div className={cn("flex items-center w-full justify-between gap-1 overflow-x-auto pt-1 no-scrollbar", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.id < activeStepIndex
        const isCurrentActive = step.id === activeStepIndex
        const isLast = index === steps.length - 1
        const hasSubSteps = Boolean(step.subSteps && step.subSteps.length > 0)

        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div
              onClick={() => {
                if (hasSubSteps) setExpandedStepId(step.id)
              }}
              className={cn("flex items-center gap-1.5 shrink-0", hasSubSteps && "cursor-pointer group")}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : isCurrentActive ? (
                <div className="relative flex items-center justify-center h-4 w-4">
                  <span
                    className={cn("animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75", activeStyle.ping)}
                  />
                  <Circle className={cn("h-3.5 w-3.5 shrink-0", activeStyle.circle)} />
                </div>
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
              )}

              <span
                className={cn(
                  "text-[11px] whitespace-nowrap font-medium transition-colors",
                  isCompleted && "text-foreground font-medium",
                  isCurrentActive && activeStyle.text,
                  !isCompleted && !isCurrentActive && "text-muted-foreground/50",
                  hasSubSteps && "group-hover:text-primary"
                )}
              >
                {step.label}
              </span>

              {/* Sub-steps Badge Indicator */}
              {hasSubSteps && (
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-muted/80 group-hover:bg-primary/10 group-hover:text-primary px-1.5 py-0.5 rounded transition-colors text-muted-foreground font-normal">
                  {step.subSteps!.length} Rounds
                  <ChevronDown className="h-3 w-3" />
                </span>
              )}
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 min-w-3 flex-1 rounded-full transition-colors",
                  step.id < activeStepIndex ? "bg-emerald-500/80" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
