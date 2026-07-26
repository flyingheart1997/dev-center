"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface InterviewCardItemProps {
  id: string
  candidateName: string
  jobTitle?: string
  roundTitle: string
  timeText: string
  interviewerName?: string
  interviewerRole?: string
  isInterviewerOnly?: boolean
  actionButton: React.ReactNode
  accentColor?: "purple" | "amber"
}

export function InterviewCardItem({
  candidateName,
  jobTitle,
  roundTitle,
  timeText,
  interviewerName,
  interviewerRole,
  isInterviewerOnly = false,
  actionButton,
  accentColor = "purple",
}: InterviewCardItemProps) {
  const candidateInitials = candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)

  const resolvedInterviewerName = interviewerName || "Aarav Sharma"
  const resolvedInterviewerRole = interviewerRole || "VP of Engineering"

  const interviewerInitials = resolvedInterviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)

  const round = roundTitle.includes(":")
    ? roundTitle.split(":")[0].trim()
    : roundTitle

  const roundSubTitle = roundTitle.includes(":")
    ? roundTitle.split(":")[1].trim()
    : roundTitle

  const badgeClass =
    accentColor === "amber"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"

  // Option A: Single-Row Compact Card for Assigned Interviewer View
  if (isInterviewerOnly) {
    return (
      <div className="p-3.5 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
            <AvatarFallback
              className={cn(
                "text-xs font-bold",
                accentColor === "amber"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
              )}
            >
              {candidateInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip side="top" content={candidateName}>
                <span className="font-semibold text-sm text-foreground truncate leading-tight w-fit max-w-full inline-block">
                  {candidateName}
                </span>
              </Tooltip>
              <Tooltip side="top" content={roundSubTitle}>
                <Badge variant="outline" className={cn("text-[10px] font-medium py-0.5 px-2 max-w-27.5 inline-block truncate", badgeClass)}>
                  {round}
                </Badge>
              </Tooltip>
            </div>

            <Tooltip side="top" content={jobTitle || "Job Candidate"}>
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5 w-fit max-w-full inline-block">
                {jobTitle || "Job Candidate"}
              </span>
            </Tooltip>
          </div>
        </div>

        {actionButton}
      </div>
    )
  }

  // Option B: Multi-Role Detailed Card for Owner / Admin / HR View
  return (
    <div className="p-3.5 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors space-y-3">
      {/* Candidate Info Section (Top Row) */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {candidateInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Tooltip side="top" content={candidateName}>
                <span className="font-semibold text-sm text-foreground truncate leading-tight w-fit max-w-full inline-block">
                  {candidateName}
                </span>
              </Tooltip>
              <Badge variant="outline" className="text-[9px] py-0 px-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shrink-0 font-normal">
                Candidate
              </Badge>
            </div>
            <Tooltip side="top" content={jobTitle || "Job Candidate"}>
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5 w-fit max-w-full inline-block">
                {jobTitle || "Job Candidate"}
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Tooltip side="top" content={roundSubTitle}>
            <Badge variant="outline" className={cn("text-[10px] font-medium py-0.5 px-2 max-w-27.5 inline-block truncate", badgeClass)}>
              {round}
            </Badge>
          </Tooltip>
          <span className="text-[11px] font-medium text-muted-foreground shrink-0 bg-muted/60 px-2 py-0.5 rounded">
            {timeText}
          </span>
        </div>
      </div>

      {/* Interviewer & Action Footer Box (Bottom Row) */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-muted/40 border border-border/50 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <Avatar className="h-8 w-8 shrink-0 border border-amber-500/20">
            <AvatarFallback className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {interviewerInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1">
            <Tooltip side="top" content={resolvedInterviewerName}>
              <span className="text-xs font-semibold text-foreground truncate leading-tight w-fit max-w-full inline-block">
                {resolvedInterviewerName}
              </span>
            </Tooltip>
            <Tooltip side="top" content={resolvedInterviewerRole}>
              <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5 w-fit max-w-full inline-block">
                {resolvedInterviewerRole}
              </span>
            </Tooltip>
          </div>
        </div>

        {actionButton}
      </div>
    </div>
  )
}
