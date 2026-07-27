"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ArrowRight, ArrowUpRight } from "lucide-react"
import { JobRequisitionCard, JobRequisitionData } from "@/features/jobs/components/job-requisition-card"

export interface ActiveJobItem {
  id: string
  title: string
  departmentName: string
  branchName: string
  location: string
  remoteType: string
  experienceLevel?: string
  employmentType?: string
  skills?: string[]
  applicantCount: number
  createdAt: string
  createdByName?: string
}

interface ActiveJobsWidgetProps {
  jobs: ActiveJobItem[]
  isLoading?: boolean
}

export function ActiveJobsWidget({ jobs, isLoading = false }: ActiveJobsWidgetProps) {
  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <Briefcase className="h-5 w-5 text-blue-500 shrink-0" />
            <span className="truncate">Active Published Job Requisitions</span>
          </CardTitle>
          <CardDescription className="truncate">
            Live job postings receiving candidate ATS applications ({jobs.length} active)
          </CardDescription>
        </div>

        {/* Header Action: View All Button */}
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3 text-xs font-medium">
          <Link href="/jobs?tab=actives">
            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <JobRequisitionCard isLoading={true} />
            <JobRequisitionCard isLoading={true} />
            <JobRequisitionCard isLoading={true} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Active Jobs Published</p>
            <p className="text-xs text-muted-foreground">
              There are currently no active job requisitions receiving candidate applications.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const mappedJob: JobRequisitionData = {
              id: job.id,
              title: job.title,
              departmentName: job.departmentName,
              location: job.location,
              remoteType: job.remoteType,
              createdByName: job.createdByName || "Aarav Sharma",
              postedAt: job.createdAt,
              applicantCount: job.applicantCount,
              isDraft: false,
            }

            return <JobRequisitionCard key={job.id} job={mappedJob} />
          })
        )}
      </CardContent>
    </Card>
  )
}
