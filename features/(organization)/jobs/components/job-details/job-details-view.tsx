"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useJobDetails } from "../../hooks/use-job-details"
import { JobDetailsHeader } from "./job-details-header"
import { JobAnalyticsStrip } from "./job-analytics-strip"
import { JobDetailsSpecCard } from "./job-details-spec-card"
import { JobCreationPropertiesCard } from "./job-creation-properties-card"
import { JobRoundsSection } from "./job-rounds-section"
import { JobSourcingSection } from "./job-sourcing-section"
import { JobCandidatesSection } from "./job-candidates-section"
import { HiredCandidatesCard } from "./hired-candidates-card"
import { OtherRequisitionsWidget } from "./other-requisitions-widget"
import { JobDetailsSkeleton } from "./job-details-skeleton"

export function JobDetailsView({ jobId }: { jobId?: string }) {
  const {
    job,
    isLoading,
    isError,
    error,
  } = useJobDetails(jobId)

  if (isLoading) {
    return <JobDetailsSkeleton />
  }

  if (isError || !job) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center space-y-4 py-12">
        <Card className="p-8 border-dashed border-red-500/40 bg-red-500/5 space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Requisition Not Found</h3>
            <p className="text-xs text-muted-foreground">
              {error?.message || "The requested job requisition could not be loaded or you do not have permission to view it."}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/jobs">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Requisitions
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5 w-full min-w-0">
      {/* 1. Hero Header Banner */}
      <JobDetailsHeader />

      {/* 2. KPI Analytics Strip */}
      <JobAnalyticsStrip />

      {/* 3. Main Page Layout Grid (Left Main Column: 9, Right Sidebar Column: 3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start w-full">
        {/* LEFT MAIN COLUMN (9 COLS WIDE ON DESKTOP) */}
        <div className="xl:col-span-9 space-y-6 min-w-0 w-full">
          {/* 1. Job Description & Role Scope + Skills + Requisition Approval Routing & History */}
          <JobDetailsSpecCard />

          {/* 2. Evaluation & Assessment Pipeline Rounds (4) */}
          <JobRoundsSection />

          {/* 3. Candidates ATS Management Pipeline Section */}
          <div className="pt-4 border-t border-border/60 w-full">
            <JobCandidatesSection />
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN: 2 Masonry-Style Columns on Tablet (md to xl) with 0 Gaps */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 min-w-0 w-full items-start">
          {/* Column 1 (Creation Properties + Hired Candidates) */}
          <div className="space-y-5 min-w-0 w-full">
            <JobCreationPropertiesCard />
            <HiredCandidatesCard />
          </div>

          {/* Column 2 (Connected Job Boards + Workspace Requisitions) */}
          <div className="space-y-5 min-w-0 w-full">
            <JobSourcingSection />
            <OtherRequisitionsWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
