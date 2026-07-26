"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Briefcase, Video, UserCheck, AlertCircle } from "lucide-react"
import { useOrgDashboard } from "../hooks/use-org-dashboard"
import { KpiSummaryCards } from "./kpi-summary-cards"
import { ActiveJobsWidget } from "./active-jobs-widget"
import { DraftJobsWidget } from "./draft-jobs-widget"
import { PendingRequisitionsWidget } from "./pending-requisitions-widget"
import { RoleActionButtons } from "./role-action-buttons"
import { AiScreeningAnalyticsWidget } from "./ai-screening-analytics-widget"
import { PendingScorecardsWidget } from "./pending-scorecards-widget"
import { PendingOffersWidget } from "./pending-offers-widget"
import { RecentCandidatesWidget } from "./recent-candidates-widget"
import { UpcomingInterviewsWidget } from "./upcoming-interviews-widget"
import { EmployeeRole } from "@/types/enums"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function OrganizationDashboard() {
  const { data: session } = useSession()
  const { data, isLoading, isError, error } = useOrgDashboard()

  const role = session?.user?.role as EmployeeRole | undefined
  const isOwnerOrAdmin = role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN
  const isInterviewer = role === EmployeeRole.INTERVIEWER

  return (
    <div className="space-y-8 pb-8">
      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load dashboard metrics</AlertTitle>
          <AlertDescription>
            {error?.message || "An unknown error occurred."}
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Section */}
      {!isInterviewer && <KpiSummaryCards stats={data?.stats} isLoading={isLoading} />}

      {/* Main Operational Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Operational Section (2 Columns) - Appears 2nd on mobile (< lg), 1st on desktop (>= lg) */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-4">
          {/* 1. AI Voice & Code Screening Arena Analytics Chart */}
          {!isInterviewer && (
            <AiScreeningAnalyticsWidget analytics={data?.aiScreeningAnalytics} isLoading={isLoading} />
          )}

          {/* 2. Active Jobs Table with Search & Filters (Max 5) */}
          <ActiveJobsWidget jobs={data?.activeJobsList || []} isLoading={isLoading} />

          {/* 3. Draft Jobs Completion Progress Widget (Max 5) */}
          <DraftJobsWidget drafts={data?.draftJobsList || []} isLoading={isLoading} />

          {/* 4. Recent Candidate Screening Evaluations (Max 5) */}
          {!isInterviewer && (
            <RecentCandidatesWidget candidates={data?.recentCandidates || []} isLoading={isLoading} />
          )}
        </div>

        {/* Right Action Sidebar Section (1 Column) - Appears 1st on mobile (< lg), 2nd on desktop (>= lg) */}
        <div className="order-1 lg:order-2 space-y-4">
          {/* 1. Role-Based Action Buttons Grid */}
          <RoleActionButtons role={role} />

          {/* 2. Scheduled Live Interviews (Max 2) */}
          <UpcomingInterviewsWidget
            interviews={data?.myUpcomingInterviews || []}
            isInterviewerOnly={isInterviewer}
            isLoading={isLoading}
          />

          {/* 3. Pending Interview Scorecards Queue (Max 2) */}
          <PendingScorecardsWidget
            scorecards={data?.pendingScorecardsList || []}
            isInterviewerOnly={isInterviewer}
            isLoading={isLoading}
          />

          {/* 4. Pending Candidate Job Offers (Max 2) */}
          {!isInterviewer && (
            <PendingOffersWidget
              offers={data?.pendingOffersList || []}
              isLoading={isLoading}
            />
          )}

          {/* 5. Pending Requisitions Verification Queue (Max 2) */}
          <PendingRequisitionsWidget
            requisitions={data?.pendingRequisitionsList || []}
            isOwnerOrAdmin={isOwnerOrAdmin}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
