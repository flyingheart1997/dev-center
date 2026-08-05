"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Trophy, Users, ArrowUpRight, Sparkles } from "lucide-react"

interface PerformingJob {
  id: string
  title: string
  departmentName: string
  applicantCount: number
  avgAiScore?: number
}

interface TopPerformingJobsWidgetProps {
  jobs?: PerformingJob[]
  isLoading?: boolean
}

const fallbackJobs: PerformingJob[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer (Next.js & Python)",
    departmentName: "Engineering",
    applicantCount: 48,
    avgAiScore: 92,
  },
  {
    id: "job-2",
    title: "AI / ML Systems Architect",
    departmentName: "AI Research",
    applicantCount: 36,
    avgAiScore: 89,
  },
  {
    id: "job-3",
    title: "DevOps & Cloud Infrastructure Specialist",
    departmentName: "Cloud Ops",
    applicantCount: 28,
    avgAiScore: 85,
  },
  {
    id: "job-4",
    title: "Product Designer (Design Systems & WebRTC UI)",
    departmentName: "Product Design",
    applicantCount: 22,
    avgAiScore: 88,
  },
  {
    id: "job-5",
    title: "Cybersecurity Compliance Lead",
    departmentName: "Security",
    applicantCount: 19,
    avgAiScore: 90,
  },
]

export function TopPerformingJobsWidget({
  jobs = fallbackJobs,
  isLoading = false,
}: TopPerformingJobsWidgetProps) {
  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="border-b border-border/50 py-3 shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <Tooltip content="Top Performing Requisitions">
              <CardTitle className="text-base font-bold flex items-center gap-2 min-w-0 truncate">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="truncate min-w-0">Top Performing Requisitions</span>
              </CardTitle>
            </Tooltip>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shrink-0"
          >
            Top 5 Magnets
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          Requisitions receiving maximum AI ATS candidate volume
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {jobs.map((job, rank) => (
          <div
            key={job.id}
            className="p-3 rounded-lg border border-border/80 bg-card hover:bg-accent/40 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center justify-center shrink-0">
                {rank + 1}
              </span>

              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip content={job.title}>
                  <h4 className="font-bold text-xs text-foreground truncate min-w-0 group-hover:text-primary transition-colors">
                    {job.title}
                  </h4>
                </Tooltip>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground min-w-0">
                  <Badge variant="outline" className="text-[9px] py-0 px-2 font-normal truncate max-w-22.5 shrink-0">
                    {job.departmentName}
                  </Badge>
                  {job.avgAiScore && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0 truncate">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" /> {job.avgAiScore}% Avg AI
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip content={`${job.applicantCount} Candidate Applications Received`}>
                <Badge variant="outline" className="text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                  <Users className="w-3 h-3 mr-1" /> {job.applicantCount}
                </Badge>
              </Tooltip>

              <Tooltip content="View Requisition ATS & Applicants">
                <Button variant="ghost" size="icon-xs" asChild>
                  <Link href={`/jobs/${job.id}`}>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </Button>
              </Tooltip>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
