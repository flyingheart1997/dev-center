"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Building2, Layers, Users, UserCheck, Award, MapPin, TrendingUp } from "lucide-react"

export interface PipelineStageItem {
  label: string
  count: number
  percentage: number
  barColor: string
  textColor: string
  pillBadge: string
  icon: any
}

interface TalentPoolSummaryWidgetProps {
  title?: string
  description?: string
  branchName?: string
  isHeadOffice?: boolean
  customStages?: PipelineStageItem[]
  stats?: {
    activeJobsCount?: number
    interviewingCount?: number
    offersCount?: number
    hiredCount?: number
  }
}

export function TalentPoolSummaryWidget({
  title = "Pipeline Distribution",
  description = "Real-time candidate funnel stage breakdown",
  branchName = "Corporate Headquarters",
  isHeadOffice = true,
  customStages,
  stats = {
    activeJobsCount: 8,
    interviewingCount: 18,
    offersCount: 4,
    hiredCount: 12,
  },
}: TalentPoolSummaryWidgetProps) {
  const defaultPipelineStages: PipelineStageItem[] = [
    {
      label: "Applied & AI Pre-Screening",
      count: stats.activeJobsCount ? stats.activeJobsCount * 5 : 42,
      percentage: 45,
      barColor: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      pillBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: Layers,
    },
    {
      label: "Live Technical Interviews",
      count: stats.interviewingCount || 18,
      percentage: 28,
      barColor: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      pillBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: Users,
    },
    {
      label: "Offers Extended & Pending",
      count: stats.offersCount || 4,
      percentage: 12,
      barColor: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      pillBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: UserCheck,
    },
    {
      label: "Hired Talent Onboarded",
      count: stats.hiredCount || 12,
      percentage: 25,
      barColor: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      pillBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: Award,
    },
  ]

  const pipelineStages = customStages || defaultPipelineStages

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="border-b border-border/50 py-3 shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <Tooltip content={title}>
              <CardTitle className="text-base font-bold flex items-center gap-2 min-w-0 truncate">
                <Building2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="truncate min-w-0">{title}</span>
              </CardTitle>
            </Tooltip>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shrink-0"
          >
            {isHeadOffice ? "Headquarters Scope" : `${branchName} Scope`}
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-4 text-xs">
        {pipelineStages.map((stage, idx) => {
          const StageIcon = stage.icon

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <Tooltip content={`Scope: ${stage.label}`}>
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 cursor-default">
                    <StageIcon className={`w-3.5 h-3.5 ${stage.textColor} shrink-0`} />
                    <span className="font-medium text-foreground truncate min-w-0">{stage.label}</span>
                  </div>
                </Tooltip>

                {/* Pill Badges for Count & Percentage */}
                <Tooltip content={`${stage.count} items (${stage.percentage}% of overall scope)`}>
                  <div className="flex items-center gap-1.5 shrink-0 cursor-default">
                    <span className="font-bold text-xs text-foreground bg-muted/80 px-2 py-0.5 rounded-md border border-border/60">
                      {stage.count}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold py-0.5 px-2 border flex items-center gap-1 ${stage.pillBadge}`}
                    >
                      <TrendingUp className="w-2.5 h-2.5" />
                      {stage.percentage}%
                    </Badge>
                  </div>
                </Tooltip>
              </div>

              {/* Styled Track Bar via shadcn Progress primitive */}
              <Progress value={stage.percentage} className="h-2 bg-muted/60" indicatorClassName={stage.barColor} />
            </div>
          )
        })}

        <div className="pt-1">
          <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between gap-2 text-muted-foreground min-w-0">
            <span className="flex items-center gap-1.5 text-[11px] truncate min-w-0 flex-1">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> <span className="truncate">Multi-Tenant Branch Scoping</span>
            </span>
            <Badge variant="secondary" className="text-[10px] font-semibold py-0 px-2 shrink-0">
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
