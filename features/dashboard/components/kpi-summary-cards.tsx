import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { Briefcase, Users, Video, ClipboardCheck, TrendingUp, Sparkles, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiStats {
  activeJobs: number
  draftJobs: number
  totalCandidates: number
  scheduledInterviews: number
  pendingApprovals: number
  totalBranches?: number
  totalEmployees?: number
}

interface KpiSummaryCardsProps {
  stats?: KpiStats | null
  isLoading?: boolean
}

export function KpiSummaryCards({ stats, isLoading = false }: KpiSummaryCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border shadow-xs bg-card">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
                <div className="flex flex-col space-y-1.5 min-w-0">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-12 rounded-md shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      id: "kpi-active-jobs",
      title: "Active Job Requisitions",
      value: stats.activeJobs,
      subtitle: `${stats.draftJobs || 2} Drafts in setup`,
      trendText: "+12%",
      trendIcon: TrendingUp,
      trendColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: Briefcase,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
      glowBg: "from-card via-card to-blue-500/5",
      sparklineHeights: ["h-2 bg-blue-500/25", "h-4 bg-blue-500/45", "h-3 bg-blue-500/35", "h-5 bg-blue-500/65", "h-6 bg-blue-500"],
    },
    {
      id: "kpi-candidates",
      title: "Pipeline Candidates",
      value: stats.totalCandidates,
      subtitle: "78% AI Screening Pass Rate",
      trendText: "+18%",
      trendIcon: Sparkles,
      trendColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: Users,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      glowBg: "from-card via-card to-emerald-500/5",
      sparklineHeights: ["h-2 bg-emerald-500/25", "h-4 bg-emerald-500/45", "h-3 bg-emerald-500/35", "h-5 bg-emerald-500/65", "h-6 bg-emerald-500"],
    },
    {
      id: "kpi-interviews",
      title: "Scheduled Interviews",
      value: stats.scheduledInterviews,
      subtitle: "LiveKit Video Rooms Ready",
      trendText: "Today",
      trendIcon: Clock,
      trendColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: Video,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
      glowBg: "from-card via-card to-purple-500/5",
      sparklineHeights: ["h-3 bg-purple-500/25", "h-2 bg-purple-500/35", "h-5 bg-purple-500/55", "h-4 bg-purple-500/70", "h-6 bg-purple-500"],
    },
    {
      id: "kpi-approvals",
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      subtitle: "Sign-off Action Required",
      trendText: "Action Req",
      trendIcon: AlertCircle,
      trendColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: ClipboardCheck,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      glowBg: "from-card via-card to-amber-500/5",
      sparklineHeights: ["h-2 bg-amber-500/25", "h-3 bg-amber-500/35", "h-4 bg-amber-500/55", "h-5 bg-amber-500/75", "h-6 bg-amber-500"],
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trendIcon

        return (
          <Card
            key={card.id}
            className={cn(
              "border-border shadow-xs bg-linear-to-br hover:border-border/80 transition-all duration-200",
              card.glowBg
            )}
          >
            <CardContent className="px-4 py-0 flex items-center justify-between gap-3 min-w-0">
              {/* Left: Icon & Value Stack */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center shrink-0", card.iconBg)}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">
                      {card.value}
                    </span>
                    <Badge variant="outline" className={cn("text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5", card.trendColor)}>
                      <TrendIcon className="h-2.5 w-2.5" />
                      {card.trendText}
                    </Badge>
                  </div>
                  <Tooltip side="top" content={card.title}>
                    <span className="text-xs font-semibold text-foreground truncate mt-0.5 w-fit max-w-full inline-block">
                      {card.title}
                    </span>
                  </Tooltip>
                  <span className="text-[10px] text-muted-foreground truncate font-normal">
                    {card.subtitle}
                  </span>
                </div>
              </div>

              {/* Far Right: Mini Sparkline Activity Visualizer */}
              <div className="hidden sm:flex items-end gap-1 shrink-0 h-6 border-l border-border/40 pl-3">
                {card.sparklineHeights.map((hClass, idx) => (
                  <div key={idx} className={cn("w-1 rounded-full", hClass)} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
