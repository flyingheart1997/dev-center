"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot, Sparkles, CheckCircle2, Users, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CandidateKpisWidgetProps {
  totalScreened?: number
  avgScore?: number
  passRate?: number
  activeCount?: number
  isLoading?: boolean
}

export function CandidateKpisWidget({
  totalScreened = 115,
  avgScore = 88,
  passRate = 74,
  activeCount = 42,
  isLoading = false,
}: CandidateKpisWidgetProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    )
  }

  const kpiItems = [
    {
      id: "total",
      title: "Total Screened",
      value: totalScreened,
      subtitle: "AI Arena Verified",
      trendText: "+14%",
      trendIcon: TrendingUp,
      trendBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: Bot,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
      valueColor: "text-foreground",
      glowBg: "from-card via-card to-blue-500/5",
      sparklineHeights: [35, 55, 45, 75, 100],
      barBg: "bg-blue-500/30",
      barActiveBg: "bg-blue-500",
    },
    {
      id: "avgScore",
      title: "Avg AI Score",
      value: `${avgScore}%`,
      subtitle: "Top 15% Benchmark",
      trendText: "+5%",
      trendIcon: Sparkles,
      trendBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: Sparkles,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      glowBg: "from-card via-card to-emerald-500/5",
      sparklineHeights: [40, 60, 50, 70, 95],
      barBg: "bg-emerald-500/30",
      barActiveBg: "bg-emerald-500",
    },
    {
      id: "passRate",
      title: "Arena Pass Rate",
      value: `${passRate}%`,
      subtitle: "Pre-Screening Clear",
      trendText: "+8%",
      trendIcon: TrendingUp,
      trendBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: CheckCircle2,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
      valueColor: "text-purple-600 dark:text-purple-400",
      glowBg: "from-card via-card to-purple-500/5",
      sparklineHeights: [50, 40, 65, 80, 95],
      barBg: "bg-purple-500/30",
      barActiveBg: "bg-purple-500",
    },
    {
      id: "active",
      title: "Active Candidates",
      value: activeCount,
      subtitle: "Under Evaluation",
      trendText: "+10%",
      trendIcon: TrendingUp,
      trendBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: Users,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      valueColor: "text-amber-600 dark:text-amber-400",
      glowBg: "from-card via-card to-amber-500/5",
      sparklineHeights: [30, 50, 45, 70, 90],
      barBg: "bg-amber-500/30",
      barActiveBg: "bg-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((kpi) => {
        const KpiIcon = kpi.icon
        const TrendIcon = kpi.trendIcon

        return (
          <div
            key={kpi.id}
            className={cn(
              "p-3.5 rounded-lg border border-border bg-linear-to-br hover:border-border/80 transition-all duration-200 flex items-center justify-between gap-3 min-w-0 shadow-xs group",
              kpi.glowBg
            )}
          >
            {/* Left Portion: Icon + Values */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", kpi.iconBg)}>
                <KpiIcon className="h-4 w-4" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-medium text-muted-foreground truncate">
                  {kpi.title}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                  <span className={cn("text-lg font-bold leading-none truncate tracking-tight", kpi.valueColor)}>
                    {kpi.value}
                  </span>
                  <Badge variant="outline" className={cn("text-[9px] py-0 px-1 font-medium shrink-0 flex items-center gap-0.5", kpi.trendBadge)}>
                    <TrendIcon className="h-2 w-2" />
                    {kpi.trendText}
                  </Badge>
                </div>
                <span className="text-[9px] text-muted-foreground/80 truncate font-normal mt-0.5">
                  {kpi.subtitle}
                </span>
              </div>
            </div>

            {/* Right Portion: Micro Sparkline Bars Visual */}
            <div className="flex items-end gap-1 h-9 shrink-0 pr-1">
              {kpi.sparklineHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={cn(
                    "w-1.5 rounded-t transition-all duration-300",
                    i === kpi.sparklineHeights.length - 1
                      ? kpi.barActiveBg
                      : kpi.barBg
                  )}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
