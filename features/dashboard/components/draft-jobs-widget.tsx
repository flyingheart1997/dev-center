"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"
import { FileEdit, ArrowRight, AlertCircle, Building2, User } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"

export interface DraftJobItem {
  id: string
  title: string
  departmentName: string
  createdByName?: string
  completionPercentage: number
  missingSteps: string[]
  createdAt: string
}

interface DraftJobsWidgetProps {
  drafts: DraftJobItem[]
  isLoading?: boolean
}

function getDraftSetupSteps(completionPercentage: number): { steps: TimelineStepItem[]; activeIndex: number } {
  const activeIndex = Math.min(5, Math.ceil((completionPercentage / 100) * 5))

  const steps: TimelineStepItem[] = [
    { id: 1, label: "Basic Info" },
    { id: 2, label: "Department & Location" },
    {
      id: 3,
      label: "Interview Rounds",
      subSteps: [
        { id: 1, label: "Round 1: AI Voice Pre-Screen", isCompleted: true },
        { id: 2, label: "Round 2: Live Coding Pair", isCurrentActive: true },
        { id: 3, label: "Round 3: Executive Review" },
      ],
    },
    { id: 4, label: "Compensation & Perks" },
    { id: 5, label: "Approval & Publish" },
  ]

  return { steps, activeIndex }
}

export function DraftJobsWidget({ drafts, isLoading = false }: DraftJobsWidgetProps) {
  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <FileEdit className="h-5 w-5 text-amber-500 shrink-0" />
            <span className="truncate">Incomplete Draft Requisitions</span>
          </CardTitle>
          <CardDescription className="truncate">
            Jobs requiring setup completion before publishing or submitting for approval
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3">
          <Link href="/jobs?tab=drafts">
            View Drafts ({drafts.length})
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileEdit className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Draft Requisitions</p>
            <p className="text-xs text-muted-foreground">All job requisitions are currently active or approved.</p>
          </div>
        ) : (
          drafts.map((draft) => {
            const { steps, activeIndex } = getDraftSetupSteps(draft.completionPercentage)

            return (
              <div
                key={draft.id}
                className="p-3.5 rounded-lg border border-border bg-card space-y-3 hover:bg-accent/30 transition-colors"
              >
                {/* Draft Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                  <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tooltip content={draft.title}>
                        <span className="font-semibold text-sm text-foreground truncate">{draft.title}</span>
                      </Tooltip>
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shrink-0">
                        Draft Requisition
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-foreground/80 min-w-0">
                      <div className="flex items-center gap-1 truncate">
                        <Building2 className="h-3 w-3 text-foreground/80 shrink-0" />
                        <span className="truncate block">{draft.departmentName}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 truncate font-medium text-muted-foreground">
                        <User className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="truncate block">Created by: {draft.createdByName || "Aarav Sharma"}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant='outline' size="sm" className="hidden sm:flex h-8 text-xs shrink-0 self-end sm:self-center" asChild>
                    <Link href={`/jobs/${draft.id}/edit`}>
                      Resume Setup <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                {/* Shared Interactive Timeline Bar with Click-to-Expand Sub-Steps */}
                <StepTimeline
                  steps={steps}
                  activeStepIndex={activeIndex}
                  accentColor="amber"
                />

                <Button variant='outline' size="sm" className="sm:hidden flex h-8 text-xs shrink-0 self-end sm:self-center" asChild>
                  <Link href={`/jobs/${draft.id}/edit`}>
                    Resume Setup <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
