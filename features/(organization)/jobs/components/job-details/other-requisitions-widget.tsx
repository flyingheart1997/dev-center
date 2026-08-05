"use client"

import * as React from "react"
import Link from "next/link"
import { Briefcase, ArrowUpRight, Clock, FileEdit, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { JobStatus } from "@/types/enums"
import { useJobDetails } from "../../hooks/use-job-details"

// Mock sidebar requisitions list for fast visual switching
const OTHER_REQUISITIONS_MOCK = [
  {
    id: "job-1",
    title: "AI / ML Systems Architect",
    departmentName: "AI Research",
    status: JobStatus.ACTIVE,
    applicantCount: 36,
  },
  {
    id: "job-2",
    title: "Product Designer (Design Systems)",
    departmentName: "Product Design",
    status: JobStatus.ACTIVE,
    applicantCount: 22,
  },
  {
    id: "draft-1",
    title: "Staff Security Engineer",
    departmentName: "Cybersecurity",
    status: JobStatus.DRAFT,
    applicantCount: 0,
  },
  {
    id: "pend-1",
    title: "Technical Lead (Automation)",
    departmentName: "Engineering",
    status: JobStatus.PENDING_APPROVAL,
    applicantCount: 5,
  },
]

export function OtherRequisitionsWidget() {
  const { job } = useJobDetails()
  const currentJobId = job?.id

  // Filter out the current active job from the sidebar list
  const otherJobs = OTHER_REQUISITIONS_MOCK.filter((j) => j.id !== currentJobId)

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="py-4 shadow-sm dark:bg-neutral-800 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-primary" /> Workspace Requisitions
        </CardTitle>

        <Button variant="ghost" size="sm" asChild className="h-6 px-2 text-[10px] font-semibold text-primary hover:text-primary/80">
          <Link href="/jobs">
            View All <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-2 pt-3">
        {otherJobs.map((item) => {
          const statusBadge = {
            [JobStatus.ACTIVE]: {
              label: "Live",
              className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            },
            [JobStatus.DRAFT]: {
              label: "Draft",
              className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
            },
            [JobStatus.PENDING_APPROVAL]: {
              label: "Pending",
              className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            },
            [JobStatus.COMPLETED]: {
              label: "Filled",
              className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            },
          }[item.status as JobStatus] || {
            label: item.status,
            className: "bg-muted text-muted-foreground",
          }

          return (
            <Link
              key={item.id}
              href={`/jobs/${item.id}`}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/60 hover:border-primary/40 transition-all text-left"
            >
              <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
                <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{item.departmentName}</span>
                  <span>•</span>
                  <span>{item.applicantCount} applicants</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <Badge variant="outline" className={cn("text-[10px] font-semibold py-0 px-1.5", statusBadge.className)}>
                  {statusBadge.label}
                </Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
