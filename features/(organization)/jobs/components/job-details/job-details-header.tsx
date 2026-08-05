"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Copy,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { JobStatus, EmployeeRole } from "@/types/enums"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobDetailsHeader() {
  const { data: session } = useSession()
  const {
    job,
    handleCopyShareLink,
    handleCloneJob,
    handleMarkCompleted,
    isMutating,
  } = useJobDetails()

  if (!job) return null

  const userRole = (session?.user as any)?.role as EmployeeRole

  // Permission checks
  const canEdit =
    userRole === EmployeeRole.OWNER ||
    userRole === EmployeeRole.GLOBAL_ADMIN ||
    userRole === EmployeeRole.BUSINESS_UNIT_ADMIN ||
    userRole === EmployeeRole.BRANCH_ADMIN ||
    userRole === EmployeeRole.HIRING_MANAGER ||
    userRole === EmployeeRole.RECRUITER

  const canClone =
    userRole === EmployeeRole.OWNER ||
    userRole === EmployeeRole.GLOBAL_ADMIN ||
    userRole === EmployeeRole.HIRING_MANAGER ||
    userRole === EmployeeRole.RECRUITER

  const canClose =
    userRole === EmployeeRole.OWNER ||
    userRole === EmployeeRole.GLOBAL_ADMIN ||
    userRole === EmployeeRole.HIRING_MANAGER ||
    userRole === EmployeeRole.RECRUITER

  const isDraft = job.status === JobStatus.DRAFT
  const isCompleted = job.status === JobStatus.COMPLETED

  const statusBadge = {
    [JobStatus.DRAFT]: {
      label: "Draft Requisition",
      variant: "outline" as const,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    [JobStatus.PENDING_APPROVAL]: {
      label: "Pending Approval",
      variant: "outline" as const,
      className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
      icon: AlertCircle,
    },
    [JobStatus.ACTIVE]: {
      label: "Live & Active",
      variant: "outline" as const,
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse",
      icon: CheckCircle2,
    },
    [JobStatus.COMPLETED]: {
      label: "Completed & Filled",
      variant: "outline" as const,
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: CheckCircle2,
    },
  }[job.status as JobStatus] || {
    label: job.status,
    variant: "outline" as const,
    className: "bg-muted text-muted-foreground",
    icon: Briefcase,
  }

  const StatusIcon = statusBadge.icon

  // Salary format helper
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return "Competitive Salary"
    const curr = job.currency || "USD"
    const minStr = job.salaryMin ? `${job.salaryMin.toLocaleString()}` : ""
    const maxStr = job.salaryMax ? `${job.salaryMax.toLocaleString()}` : ""
    if (minStr && maxStr) return `${curr} ${minStr} - ${maxStr} / yr`
    return `${curr} ${minStr || maxStr} / yr`
  }

  return (
    <Card className="p-4 sm:p-5 border border-border shadow-xs bg-card space-y-3">
      <div className="space-y-1.5 min-w-0 flex-1 w-full relative">
        <div className="flex flex-col items-start justify-start w-full gap-2 flex-wrap">
          <Tooltip content={job.title}>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground truncate max-w-xl">
              {job.title}
            </h1>
          </Tooltip>

          {/* Embedded REQ ID Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono py-0.5 px-2 bg-muted/60 border-border/80 shrink-0">
              REQ-{job.id.slice(0, 6).toUpperCase()}
            </Badge>

            <Badge variant={statusBadge.variant} className={cn("text-xs font-semibold py-0.5 px-2.5 flex items-center gap-1 shrink-0", statusBadge.className)}>
              <StatusIcon className="h-3 w-3" />
              {statusBadge.label}
            </Badge>

            {job.department?.name && (
              <Badge variant="outline" className="text-xs font-medium py-0.5 px-2.5 border-border bg-muted/40 shrink-0">
                <Building2 className="h-3 w-3 mr-1 text-primary" /> {job.department.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Sub-meta details bar */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-0.5">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {job.location || "Headquarters"} ({job.remoteType || "Onsite"})
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {job.employmentType?.replace(/_/g, " ") || "Full Time"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-foreground/90">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            {formatSalary()}
          </span>
          {job.publishedAt && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                Published {new Date(job.publishedAt).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
        {/* Role-Based Quick Action Buttons Toolbar */}
        <div className="lg:absolute top-0 right-0 flex items-center gap-2 flex-wrap shrink-0 mt-4 lg:mt-0 justify-end">
          <Tooltip content="Copy public application page URL">
            <Button variant="outline" size="sm" onClick={handleCopyShareLink} className="h-8 text-xs font-semibold gap-1.5 border-border/80">
              <Share2 className="h-3.5 w-3.5 text-primary" /> Share Link
            </Button>
          </Tooltip>

          {canEdit && (
            isDraft ? (
              <Button variant="default" size="sm" asChild className="h-8 text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs">
                <Link href={`/jobs/create-job?edit=${job.id}`}>
                  <Edit className="h-3.5 w-3.5" /> Resume Setup
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold gap-1.5 border-border/80">
                <Link href={`/jobs/create-job?edit=${job.id}`}>
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" /> Edit Specs
                </Link>
              </Button>
            )
          )}

          {canClone && (
            <Tooltip content="Create a copy of this requisition spec">
              <Button variant="outline" size="sm" onClick={handleCloneJob} disabled={isMutating} className="h-8 text-xs font-semibold gap-1.5 border-border/80">
                <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Clone
              </Button>
            </Tooltip>
          )}

          {canClose && !isCompleted && (
            <Button variant="secondary" size="sm" onClick={handleMarkCompleted} disabled={isMutating} className="h-8 text-xs font-semibold gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Filled
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
