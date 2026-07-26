"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import { Bot, Mic, Code2, TrendingUp, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

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
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
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
            <Tooltip content="AI Voice & Code Arena Analytics">
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

  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
            <Tooltip content="AI Voice & Code Arena Analytics">
              <span className="truncate">AI Voice & Code Arena Analytics</span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="truncate">
            Real-time candidate pre-screening performance & pass rates
          </CardDescription>
        </div>

        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0 ml-3">
          <TrendingUp className="h-3 w-3 mr-1" />
          {analytics.overallPassRate}% Overall Pass Rate
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* KPI Mini-Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-border bg-card flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Bot className="h-3.5 w-3.5 text-primary" /> Total Screened
            </span>
            <span className="text-lg font-bold text-foreground mt-0.5">{analytics.totalScreened}</span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Avg AI Score
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {analytics.avgScore}%
            </span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Mic className="h-3.5 w-3.5 text-purple-500" /> Voice Bot Pass
            </span>
            <span className="text-lg font-bold text-foreground mt-0.5">{analytics.voicePassRate}%</span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Code2 className="h-3.5 w-3.5 text-blue-500" /> Compiler Pass
            </span>
            <span className="text-lg font-bold text-foreground mt-0.5">{analytics.codePassRate}%</span>
          </div>
        </div>

        {/* Weekly Trend Interactive AreaChart */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Weekly Candidate Evaluation Volume</span>
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
            <ResponsiveContainer width="100%" height="100%">
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
