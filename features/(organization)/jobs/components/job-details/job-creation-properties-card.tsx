"use client"

import * as React from "react"
import { Award, Calendar, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobCreationPropertiesCard() {
  const { job } = useJobDetails()

  if (!job) return null

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return "Competitive"
    const curr = job.currency || "USD"
    const minStr = job.salaryMin ? `${job.salaryMin.toLocaleString()}` : ""
    const maxStr = job.salaryMax ? `${job.salaryMax.toLocaleString()}` : ""
    if (minStr && maxStr) return `${curr} ${minStr} - ${maxStr}`
    return `${curr} ${minStr || maxStr}`
  }

  const createdByName = job.createdBy?.name || "Aarav Sharma"
  const createdDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "7/16/2026"

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="py-4 shadow-sm dark:bg-neutral-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-primary shrink-0" /> Creation Properties
        </CardTitle>
      </CardHeader>

      <CardContent className="text-xs min-w-0">
        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Created By</span>
          <span className="font-semibold text-foreground flex items-center gap-1 truncate text-right text-[11px]">
            <UserCheck className="h-3 w-3 text-primary shrink-0" /> {createdByName}
          </span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Created Date</span>
          <span className="font-semibold text-foreground flex items-center gap-1 truncate text-right text-[11px]">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" /> {createdDate}
          </span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Department</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.department?.name || "Engineering"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Branch</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.branch?.name || job.location || "San Francisco"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Business Unit</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.businessUnit?.name || "Core Platform"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Type</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.employmentType?.replace(/_/g, " ") || "Full Time"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Level</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.experienceLevel || "Senior"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/40 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Remote</span>
          <span className="font-semibold text-foreground truncate text-right text-[11px]">{job.remoteType || "Hybrid"}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 gap-2">
          <span className="text-muted-foreground shrink-0 text-[11px]">Target Salary</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate text-right text-[11px]">{formatSalary()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
