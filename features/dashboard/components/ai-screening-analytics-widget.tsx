"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import { Bot, Mic, Code2, TrendingUp, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export interface ScreeningAnalyticsData {
  overallPassRate: number
  avgScore: number
  totalScreened: number
  voicePassRate: number
  codePassRate: number
  weeklyTrend: Array<{
    day: string
    pass: number
    fail: number
    avgScore: number
  }>
}

interface AiScreeningAnalyticsWidgetProps {
  analytics?: ScreeningAnalyticsData | null
  isLoading?: boolean
}

const chartConfig: ChartConfig = {
  pass: {
    label: "Passed Screening",
    color: "hsl(142.1 76.2% 36.3%)", // emerald
  },
  fail: {
    label: "Failed Screening",
    color: "hsl(0 84.2% 60.2%)", // rose/red
  },
}

export function AiScreeningAnalyticsWidget({ analytics, isLoading = false }: AiScreeningAnalyticsWidgetProps) {
  if (isLoading) {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-500" />
            AI Voice & Code Arena Analytics
          </CardTitle>
          <CardDescription>Real-time candidate pre-screening performance & pass rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!analytics || !analytics.weeklyTrend || analytics.weeklyTrend.length === 0) {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
            <Tooltip side="top" content="AI Voice & Code Arena Analytics">
              <span className="truncate">AI Voice & Code Arena Analytics</span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="truncate">
            Real-time candidate pre-screening performance & pass rates
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center border rounded-lg bg-muted/20 m-6 mt-0 flex flex-col items-center justify-center space-y-2">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">No Screening Data Available</p>
          <p className="text-xs text-muted-foreground">
            Candidate AI voice and virtual compiler evaluations will appear here once candidates start pre-screening.
          </p>
        </CardContent>
      </Card>
    )
  }

  const kpiCards = [
    {
      id: "screened",
      title: "Total Screened",
      value: analytics.totalScreened,
      subtitle: "AI Arena Verified",
      trendText: "+14%",
      trendIcon: TrendingUp,
      trendBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: Bot,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
      valueColor: "text-foreground",
      glowBg: "from-card via-card to-blue-500/5",
    },
    {
      id: "avgScore",
      title: "Avg AI Score",
      value: `${analytics.avgScore}%`,
      subtitle: "Top 15% Benchmark",
      trendText: "+5%",
      trendIcon: Sparkles,
      trendBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      glowBg: "from-card via-card to-emerald-500/5",
    },
    {
      id: "voicePass",
      title: "Voice Bot Pass",
      value: `${analytics.voicePassRate}%`,
      subtitle: "Verbal & Fluency",
      trendText: "+8%",
      trendIcon: TrendingUp,
      trendBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: Mic,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
      valueColor: "text-purple-600 dark:text-purple-400",
      glowBg: "from-card via-card to-purple-500/5",
    },
    {
      id: "codePass",
      title: "Compiler Pass",
      value: `${analytics.codePassRate}%`,
      subtitle: "Virtual Execution",
      trendText: "+6%",
      trendIcon: TrendingUp,
      trendBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: Code2,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      valueColor: "text-amber-600 dark:text-amber-400",
      glowBg: "from-card via-card to-amber-500/5",
    },
  ]

  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
            <Tooltip side="top" content="AI Voice & Code Arena Analytics">
              <span className="truncate">AI Voice & Code Arena Analytics</span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="truncate mt-0.5">
            Real-time candidate pre-screening performance & pass rates
          </CardDescription>
        </div>

        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0 ml-3 py-1 px-2.5">
          <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
          {analytics.overallPassRate}% Overall Pass Rate
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-3">
        {/* KPI Mini-Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpiCards.map((kpi) => {
            const KpiIcon = kpi.icon
            const TrendIcon = kpi.trendIcon

            return (
              <div
                key={kpi.id}
                className={cn(
                  "p-3 rounded-lg border border-border bg-linear-to-br hover:border-border/80 transition-all duration-200 flex items-center gap-3 min-w-0",
                  kpi.glowBg
                )}
              >
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
            )
          })}
        </div>

        {/* Weekly Trend Interactive AreaChart */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Weekly Candidate Evaluation Volume
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Passed
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Failed
              </span>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={analytics.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fillFail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="pass" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#fillPass)" />
                <Area type="monotone" dataKey="fail" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#fillFail)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
