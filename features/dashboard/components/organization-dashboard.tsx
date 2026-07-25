"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Briefcase, Video, UserCheck, AlertCircle } from "lucide-react"
import { useOrgDashboard } from "../hooks/use-org-dashboard"
import { KpiSummaryCards } from "./kpi-summary-cards"
import { KpiSummarySkeleton } from "./kpi-summary-skeleton"
import { ActiveJobsWidget } from "./active-jobs-widget"
import { DraftJobsWidget } from "./draft-jobs-widget"
import { PendingRequisitionsWidget } from "./pending-requisitions-widget"
import { RoleActionButtons } from "./role-action-buttons"
import { TodayActionTasksWidget } from "./today-action-tasks-widget"
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

      {/* KPI Section (Untouched) */}
      {isLoading ? (
        !isInterviewer && <KpiSummarySkeleton />
      ) : (
        data?.stats && <KpiSummaryCards stats={data.stats} />
      )}

      {/* Main Operational Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Operational Section (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Jobs Table with Search & Filters */}
          <ActiveJobsWidget jobs={data?.activeJobsList || []} />

          {/* Draft Jobs Completion Progress Widget */}
          <DraftJobsWidget drafts={data?.draftJobsList || []} />

          {/* Pending Requisitions Verification Queue */}
          <PendingRequisitionsWidget
            requisitions={data?.pendingRequisitionsList || []}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />

          {/* Recent Candidate Screening Evaluations */}
          {!isInterviewer && (
            <RecentCandidatesWidget candidates={data?.recentCandidates || []} />
          )}
        </div>

        {/* Right Action Sidebar Section (1 Column) */}
        <div className="space-y-6">
          {/* Role-Based Action Buttons Grid */}
          <RoleActionButtons role={role} />

          {/* Today's Action Checklist */}
          <TodayActionTasksWidget tasks={data?.todaysTasks || []} />

          {/* Scheduled Live Interviews */}
          <UpcomingInterviewsWidget
            interviews={data?.myUpcomingInterviews || []}
          />

          {/* Quick Actions Shortcuts */}
          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <CardDescription>Management shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {!isInterviewer && (
                <Button variant="outline" className="w-full justify-start h-10 text-xs" asChild>
                  <Link href="/jobs">
                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                    Manage Job Postings
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start h-10 text-xs" asChild>
                <Link href="/interviews">
                  <Video className="h-4 w-4 mr-2 text-purple-500" />
                  Live Interview Rooms
                </Link>
              </Button>
              {isOwnerOrAdmin && (
                <Button variant="outline" className="w-full justify-start h-10 text-xs" asChild>
                  <Link href="/organization">
                    <UserCheck className="h-4 w-4 mr-2 text-amber-500" />
                    Organization Hierarchy & Team
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

