"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ShieldCheck, ArrowRight } from "lucide-react"

export interface PendingRequisitionItem {
  id: string
  title: string
  departmentName: string
  createdAt: string
  approverName: string
}

interface PendingRequisitionsWidgetProps {
  requisitions: PendingRequisitionItem[]
  isOwnerOrAdmin: boolean
}

export function PendingRequisitionsWidget({ requisitions, isOwnerOrAdmin }: PendingRequisitionsWidgetProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Requisitions Pending Verification & Approval
          </CardTitle>
          <CardDescription>
            {isOwnerOrAdmin
              ? "Job requisitions requiring admin sign-off before being published"
              : "Requisitions submitted for management review"}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/approvals">
            Approvals Queue ({requisitions.length})
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {requisitions.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Pending Requisitions</p>
            <p className="text-xs text-muted-foreground">All submitted job requisitions have been verified and approved.</p>
          </div>
        ) : (
          requisitions.map((req) => (
            <div
              key={req.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-card gap-3"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{req.title}</span>
                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    Pending Approval
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{req.departmentName}</span>
                  <span>•</span>
                  <span>Approver: {req.approverName}</span>
                </div>
              </div>

              {isOwnerOrAdmin && (
                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" asChild>
                  <Link href="/approvals">
                    Review Requisition <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
