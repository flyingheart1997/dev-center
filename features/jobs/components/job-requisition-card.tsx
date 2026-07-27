"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StepTimeline, TimelineStepItem } from "@/components/ui/step-timeline"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import {
  Building2,
  User,
  MapPin,
  Users,
  FileEdit,
  FileCheck,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
} from "lucide-react"

export interface JobRequisitionData {
  id: string
  title: string
  departmentName: string
  location?: string | null
  remoteType?: string | null
  createdByName?: string | null
  postedAt?: string | null
  applicantCount?: number
  isDraft?: boolean
  isPendingApproval?: boolean
  completionPercentage?: number
  activeStepIndex?: number
  status?: string
}

interface JobRequisitionCardProps {
  job?: JobRequisitionData
  isLoading?: boolean
  showHoverOverlay?: boolean
}

function getJobSetupSteps(
  isDraft: boolean,
  isPendingApproval: boolean,
  completionPercentage: number = 60,
  activeStepIndex?: number
): { steps: TimelineStepItem[]; activeIndex: number; accentColor: "amber" | "purple" | "emerald" } {
  if (isPendingApproval) {
    const steps: TimelineStepItem[] = [
      { id: 1, label: "Basic Info" },
      { id: 2, label: "Department & Location" },
      { id: 3, label: "Interview Rounds" },
      { id: 4, label: "Compensation & Perks" },
      { id: 5, label: "Approval & Publish" },
    ]
    return { steps, activeIndex: 5, accentColor: "amber" }
  }

  if (isDraft) {
    const calculatedIndex =
      activeStepIndex || Math.min(5, Math.max(1, Math.ceil((completionPercentage / 100) * 5)))

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

    return { steps, activeIndex: calculatedIndex, accentColor: "amber" }
  }

  // Published Active Job Steps
  const steps: TimelineStepItem[] = [
    { id: 1, label: "Sourcing & Postings" },
    { id: 2, label: "AI Pre-Screening" },
    {
      id: 3,
      label: "Interview Rounds",
      subSteps: [
        { id: 1, label: "Round 1: AI Voice & Code Screening", isCompleted: true },
        { id: 2, label: "Round 2: Architecture Review", isCompleted: true },
        { id: 3, label: "Round 3: HR & Culture Fit", isCurrentActive: true },
      ],
    },
    { id: 4, label: "Offer & Negotiation" },
    { id: 5, label: "Live Active" },
  ]

  return { steps, activeIndex: 5, accentColor: "purple" }
}

export function JobRequisitionCard({
  job,
  isLoading = false,
  showHoverOverlay = true,
}: JobRequisitionCardProps) {
  // 1. Detailed Integrated Skeleton State
  if (isLoading || !job) {
    return (
      <div className="p-3.5 rounded-lg border border-border bg-card space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-28 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-10 w-full rounded-md mt-1" />
      </div>
    )
  }

  const isDraft = Boolean(job.isDraft)
  const isPendingApproval = Boolean(job.isPendingApproval)

  const { steps, activeIndex, accentColor } = getJobSetupSteps(
    isDraft,
    isPendingApproval,
    job.completionPercentage,
    job.activeStepIndex
  )

  const locationText = job.location
    ? job.remoteType
      ? `${job.location} (${job.remoteType.replace(/_/g, " ")})`
      : job.location
    : "Headquarters (Hybrid)"

  const formattedPostedDate = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="relative group p-3.5 rounded-lg border border-border bg-card space-y-3 hover:border-primary/40 hover:shadow-xs transition-all overflow-hidden">
      {/* Top Header Row: Job Title + Dept Badge (Left) vs Right Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        {/* Left: Title + Department Badge */}
        <div className="flex flex-col space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
            <Tooltip content={job.title}>
              <span className="font-semibold text-sm text-foreground truncate">
                {job.title}
              </span>
            </Tooltip>

            {job.departmentName && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
                {job.departmentName}
              </Badge>
            )}
          </div>

          {/* Unified Subtitle Meta Information */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground min-w-0">
            <Tooltip content={locationText}>
              <div className="flex items-center gap-1 min-w-0 truncate">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{locationText}</span>
              </div>
            </Tooltip>

            <span>•</span>
            <div className="flex items-center gap-1 truncate font-medium">
              <User className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="truncate">Created by: {job.createdByName || "Aarav Sharma"}</span>
            </div>

            {!isDraft && !isPendingApproval && formattedPostedDate && (
              <>
                <span>•</span>
                <span className="shrink-0 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground shrink-0" /> Posted {formattedPostedDate}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top-Right Badge: Draft Requisition OR Pending Approval OR Applicants Count */}
        <div className="flex items-center gap-2 shrink-0 self-center sm:ml-auto">
          {isPendingApproval ? (
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 shrink-0 py-1 px-2.5"
            >
              Pending Approval
            </Badge>
          ) : isDraft ? (
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shrink-0 py-1 px-2.5"
            >
              Draft Requisition
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shrink-0 flex items-center gap-1.5 py-1 px-2.5"
            >
              <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>{job.applicantCount || 0} Applicants</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Shared Interactive Timeline Step Bar */}
      <StepTimeline steps={steps} activeStepIndex={activeIndex} accentColor={accentColor} />

      {/* Glassmorphism Soft Gray Hover Overlay */}
      {showHoverOverlay && (
        <div className="absolute inset-0 rounded-lg bg-background/50 dark:bg-neutral-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-4 pointer-events-none group-hover:pointer-events-auto">
          {isPendingApproval ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="font-semibold bg-background/90 hover:bg-background shadow-sm gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150 border-orange-500/30"
            >
              <Link href={`/jobs/${job.id}`}>
                <FileCheck className="w-3.5 h-3.5 text-orange-500" /> Review & Approve
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </Button>
          ) : isDraft ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="font-semibold bg-background/90 hover:bg-background shadow-sm gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150 border-amber-500/30"
            >
              <Link href={`/jobs/${job.id}/edit`}>
                <FileEdit className="w-3.5 h-3.5 text-amber-500" /> Resume Setup
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="font-semibold bg-background/90 hover:bg-background shadow-sm gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150 border-primary/30"
            >
              <Link href={`/jobs/${job.id}`}>
                <Briefcase className="w-3.5 h-3.5 text-primary" /> View ATS
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
