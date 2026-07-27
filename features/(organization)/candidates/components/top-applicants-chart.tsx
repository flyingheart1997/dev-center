"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TopApplicantsChartProps {
  scoreRanges?: {
    high: number
    medium: number
    passing: number
    low: number
  }
  totalScreened?: number
  isLoading?: boolean
}

export function TopApplicantsChart({
  scoreRanges = { high: 0, medium: 0, passing: 0, low: 0 },
  totalScreened = 0,
  isLoading = false,
}: TopApplicantsChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader className="py-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="h-64">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    { name: "Top Performers (85-100%)", value: scoreRanges.high, color: "#10b981" },
    { name: "Strong Match (65-84%)", value: scoreRanges.medium, color: "#3b82f6" },
    { name: "Passing Score (50-64%)", value: scoreRanges.passing, color: "#f59e0b" },
    { name: "Needs Review (<50%)", value: scoreRanges.low, color: "#ef4444" },
  ]

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="py-4 flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" /> AI Evaluation Score Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Based on {totalScreened} candidate AI Pre-Screening assessments
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-48 w-48 shrink-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="space-y-2 text-xs flex-1">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground font-medium truncate max-w-40">{item.name}</span>
              </div>
              <span className="font-bold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
