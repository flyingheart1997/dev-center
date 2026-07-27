"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface CandidateGrowthChartProps {
  data?: Array<{
    month: string
    total: number
    hired: number
    interviewing: number
  }>
  isLoading?: boolean
}

export function CandidateGrowthChart({ data = [], isLoading = false }: CandidateGrowthChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading || !mounted) {
    return (
      <Card className="border border-border shadow-xs pt-0">
        <CardHeader className="py-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent className="h-56 pt-2">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <TrendingUp className="h-5 w-5 text-indigo-500 shrink-0" />
            <span className="truncate">Candidate Application Trends</span>
          </CardTitle>
          <CardDescription className="truncate mt-0.5">
            Monthly candidate pipeline growth and successful hires
          </CardDescription>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Total Applicants
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Hired Candidates
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-52 w-full min-w-0">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTotalApplicants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillHiredCandidates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Applicants"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#fillTotalApplicants)"
              />
              <Area
                type="monotone"
                dataKey="hired"
                name="Hired Candidates"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#fillHiredCandidates)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
