"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Clock, CheckCircle2, ArrowRight, User } from "lucide-react"

interface PendingApprovalJob {
  id: string
  title: string
  departmentName: string
  createdByName?: string
  submittedAt?: string
}

interface PendingApprovalWidgetProps {
  pendingJobs?: PendingApprovalJob[]
  isLoading?: boolean
  onApprove?: (jobId: string) => void
}

const fallbackPendingJobs: PendingApprovalJob[] = [
  {
    id: "pend-1",
    title: "Senior Security Architect",
    departmentName: "Cybersecurity",
    createdByName: "Aarav Sharma",
    submittedAt: "2 hours ago",
  },
  {
    id: "pend-2",
    title: "Staff Frontend Platform Lead",
    departmentName: "Engineering",
    createdByName: "Neha Verma",
    submittedAt: "5 hours ago",
  },
  {
    id: "pend-3",
    title: "Principal AI Research Scientist",
    departmentName: "AI Research",
    createdByName: "Rohan Verma",
    submittedAt: "1 day ago",
  },
]

export function PendingApprovalWidget({
  pendingJobs = fallbackPendingJobs,
  isLoading = false,
  onApprove,
}: PendingApprovalWidgetProps) {
  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="border-b border-border/50 py-3 shadow-sm dark:bg-neutral-800">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <Tooltip content="Pending Approvals Queue">
              <CardTitle className="text-base font-bold flex items-center gap-2 min-w-0 truncate">
                <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="truncate min-w-0">Pending Approvals Queue</span>
              </CardTitle>
            </Tooltip>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 shrink-0"
          >
            {pendingJobs.length} Awaiting
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          Requisitions submitted for Admin / Owner verification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {pendingJobs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No requisitions currently awaiting approval.
          </div>
        ) : (
          pendingJobs.map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-lg border border-border/80 bg-card hover:bg-accent/40 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <Tooltip content={job.title}>
                    <h4 className="font-bold text-xs text-foreground truncate min-w-0 group-hover:text-primary transition-colors">
                      {job.title}
                    </h4>
                  </Tooltip>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal truncate max-w-22.5 shrink-0">
                      {job.departmentName}
                    </Badge>
                    <span>•</span>
                    <span className="truncate min-w-0 flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-500 shrink-0" /> <span className="truncate">{job.createdByName || "Aarav Sharma"}</span>
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className="text-[9px] bg-orange-500/10 text-orange-600 border-orange-500/20 shrink-0">
                  {job.submittedAt || "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                <Tooltip content="Review requisition configuration & setup steps">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-7 text-[11px] px-2 font-medium text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href={`/jobs/${job.id}`}>
                      Review Setup <ArrowRight className="w-3 h-3 ml-1 -rotate-45" />
                    </Link>
                  </Button>
                </Tooltip>

                <Tooltip content="Approve and publish this requisition live immediately">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onApprove?.(job.id)}
                    className="h-7 text-[11px] px-2.5 font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Approve & Publish
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
