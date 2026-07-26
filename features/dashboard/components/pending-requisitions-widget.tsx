"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, ShieldCheck, ArrowRight } from "lucide-react"
import { ReassignApproverDropdown } from "./reassign-approver-dropdown"
import { Tooltip } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface PendingRequisitionItem {
  id: string
  title: string
  departmentName: string
  createdAt: string
  approverName: string
  approverRole?: string
}

interface PendingRequisitionsWidgetProps {
  requisitions: PendingRequisitionItem[]
  isOwnerOrAdmin: boolean
  isLoading?: boolean
}

export function PendingRequisitionsWidget({
  requisitions,
  isOwnerOrAdmin,
  isLoading = false,
}: PendingRequisitionsWidgetProps) {
  const [items, setItems] = useState<PendingRequisitionItem[]>(requisitions)

  useEffect(() => {
    setItems(requisitions)
  }, [requisitions])

  const handleApproverReassigned = (requisitionId: string, newApproverName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === requisitionId ? { ...item, approverName: newApproverName } : item
      )
    )
  }

  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold flex items-center gap-2 min-w-0">
            <Clock className="h-5 w-5 text-purple-500 shrink-0" />
            <Tooltip side="top" content="Requisition Approvals">
              <span className="w-fit max-w-full inline-block truncate">
                Requisition Approvals
              </span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="min-w-0 mt-0.5">
            <Tooltip side="top" content="Job requisitions awaiting management sign-off">
              <span className="w-fit max-w-full inline-block truncate text-xs text-muted-foreground">
                Job requisitions awaiting management sign-off
              </span>
            </Tooltip>
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 ml-3">
          <Link href="/approvals">
            Queue ({items.length})
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Pending Requisitions</p>
            <p className="text-xs text-muted-foreground">All submitted job requisitions have been verified and approved.</p>
          </div>
        ) : (
          items.map((req) => {
            const initials = req.approverName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)

            return (
              <div
                key={req.id}
                className="p-3.5 rounded-lg border border-border bg-card space-y-2.5 hover:bg-accent/30 transition-colors"
              >
                {/* Row 1: Title & Department Subtitle (left), Pending Approval Badge (right) */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1 space-y-0.5 pr-2">
                    <Tooltip side="top" content={req.title}>
                      <span className="font-semibold text-sm text-foreground truncate w-fit max-w-full inline-block">
                        {req.title}
                      </span>
                    </Tooltip>
                    <Tooltip side="top" content={`Department: ${req.departmentName}`}>
                      <span className="text-[11px] text-muted-foreground font-normal truncate w-fit max-w-full inline-block">
                        Dept: {req.departmentName}
                      </span>
                    </Tooltip>
                  </div>

                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shrink-0">
                    Pending Approval
                  </Badge>
                </div>

                {/* Row 2: Avatar + Approver Name & Role (left), Reassign & Review Buttons (right) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 flex-1">
                      <Tooltip side="top" content={req.approverName}>
                        <span className="text-xs font-semibold text-foreground truncate leading-tight w-fit max-w-full inline-block">
                          {req.approverName}
                        </span>
                      </Tooltip>
                      <Tooltip side="top" content={req.approverRole || "VP of Engineering"}>
                        <span className="text-[10px] text-muted-foreground truncate leading-tight w-fit max-w-full inline-block">
                          {req.approverRole || "VP of Engineering"}
                        </span>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    {/* {isOwnerOrAdmin && ( */}
                    <ReassignApproverDropdown
                      requisitionId={req.id}
                      currentApproverName={req.approverName}
                      onReassignSuccess={(newName) => handleApproverReassigned(req.id, newName)}
                    />
                    {/* )} */}

                    <Button size="xs" variant="outline" className="h-7 text-xs shrink-0" asChild>
                      <Link href={`/approvals/${req.id}`}>
                        Review
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
