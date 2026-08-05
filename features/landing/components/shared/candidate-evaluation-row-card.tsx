"use client"

import * as React from "react"
import { Mail, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DashboardTimelineNodes, TimelineNodeStep } from "./dashboard-timeline-nodes"

export interface CandidateEvaluationRowProps {
  name: string
  email: string
  role: string
  department: string
  appliedDate: string
  aiScore: number
  statusBadge: string
  statusVariant?: "purple" | "emerald" | "default"
  steps: TimelineNodeStep[]
  className?: string
}

export function CandidateEvaluationRowCard({
  name,
  email,
  role,
  department,
  appliedDate,
  aiScore,
  statusBadge,
  statusVariant = "purple",
  steps,
  className,
}: CandidateEvaluationRowProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const statusBadgeStyles = {
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    default: "bg-muted text-muted-foreground border-border",
  }[statusVariant]

  return (
    <Card className={cn("p-4 border border-border bg-card space-y-3.5 hover:border-primary/40 transition-all text-left shadow-xs", className)}>
      <div className="flex items-center justify-between gap-3 min-w-0 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 border border-border shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="font-semibold text-sm text-foreground truncate">{name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Mail className="h-3 w-3 shrink-0" /> {email}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 flex-wrap">
              <span className="font-medium text-foreground/90 truncate">{role}</span>
              <span>•</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                {department}
              </Badge>
              <span>•</span>
              <span>Applied {appliedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="py-1 px-2.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            <Sparkles className="h-3 w-3 mr-1" /> AI Score: {aiScore}%
          </Badge>
          <Badge variant="outline" className={cn("py-1 px-2.5 text-xs font-medium", statusBadgeStyles)}>
            {statusBadge}
          </Badge>
        </div>
      </div>

      {/* 5-Step Candidate ATS Pipeline Timeline */}
      <DashboardTimelineNodes steps={steps} accentColor="purple" />
    </Card>
  )
}
