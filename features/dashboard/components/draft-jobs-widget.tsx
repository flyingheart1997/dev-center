"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileEdit, ArrowUpRight } from "lucide-react"
import { JobRequisitionCard, JobRequisitionData } from "@/features/(organization)/jobs/components/job-requisition-card"

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

export function DraftJobsWidget({ drafts, isLoading = false }: DraftJobsWidgetProps) {
  return (
    <Card className="border border-border shadow-xs pt-0">
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

        {/* Header Action: View All Button */}
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3 text-xs font-medium">
          <Link href="/jobs?tab=drafts">
            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <JobRequisitionCard isLoading={true} />
            <JobRequisitionCard isLoading={true} />
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileEdit className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Draft Requisitions</p>
            <p className="text-xs text-muted-foreground">All job requisitions are currently active or approved.</p>
          </div>
        ) : (
          drafts.map((draft) => {
            const mappedJob: JobRequisitionData = {
              id: draft.id,
              title: draft.title,
              departmentName: draft.departmentName,
              createdByName: draft.createdByName || "Aarav Sharma",
              completionPercentage: draft.completionPercentage,
              isDraft: true,
              postedAt: draft.createdAt,
            }

            return <JobRequisitionCard key={draft.id} job={mappedJob} />
          })
        )}
      </CardContent>
    </Card>
  )
}
