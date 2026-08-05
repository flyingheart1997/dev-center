"use client"

import * as React from "react"
import { CheckCircle2, Circle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const accentStyles = {
    purple: {
      activeText: "text-purple-500 font-bold dark:text-purple-400",
      activeRing: "text-purple-500 fill-purple-500/20 dark:text-purple-400",
      activeLine: "bg-purple-500/80",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    amber: {
      activeText: "text-amber-500 font-bold dark:text-amber-400",
      activeRing: "text-amber-500 fill-amber-500/20 dark:text-amber-400",
      activeLine: "bg-amber-500/80",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    emerald: {
      activeText: "text-emerald-500 font-bold dark:text-emerald-400",
      activeRing: "text-emerald-500 fill-emerald-500/20 dark:text-emerald-400",
      activeLine: "bg-emerald-500/80",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  }[accentColor]

  return (
    <div className={cn("flex items-center w-full justify-between gap-1 overflow-x-auto pt-1 no-scrollbar text-xs", className)}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1

        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="flex items-center gap-1.5 shrink-0">
              {step.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : step.isActive ? (
                <div className="relative flex items-center justify-center h-4 w-4">
                  <span className={cn("animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75", accentColor === "amber" ? "bg-amber-400" : "bg-purple-400")} />
                  <Circle className={cn("h-3.5 w-3.5 shrink-0", accentStyles.activeRing)} />
                </div>
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
              )}

              <span
                className={cn(
                  "text-[11px] whitespace-nowrap font-medium transition-colors",
                  step.isCompleted && "text-foreground font-medium",
                  step.isActive && accentStyles.activeText,
                  !step.isCompleted && !step.isActive && "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>

              {/* Sub-rounds dropdown indicator if specified */}
              {step.subRounds && (
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-muted/80 px-1.5 py-0.5 rounded text-muted-foreground border border-border/50 shrink-0 font-normal">
                  {step.subRounds} Rounds
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </span>
              )}
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 min-w-3 flex-1 rounded-full transition-colors",
                  step.isCompleted ? "bg-emerald-500/80" : step.isActive ? accentStyles.activeLine : "bg-border/60"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
