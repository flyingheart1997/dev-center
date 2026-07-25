"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileEdit, ArrowRight, AlertCircle } from "lucide-react"

export interface DraftJobItem {
  id: string
  title: string
  departmentName: string
  completionPercentage: number
  missingSteps: string[]
  createdAt: string
}

interface DraftJobsWidgetProps {
  drafts: DraftJobItem[]
}

export function DraftJobsWidget({ drafts }: DraftJobsWidgetProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-amber-500" />
            Incomplete Draft Requisitions
          </CardTitle>
          <CardDescription>
            Jobs requiring setup completion before publishing or submitting for approval
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/jobs?tab=drafts">
            View Drafts ({drafts.length})
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {drafts.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileEdit className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Draft Requisitions</p>
            <p className="text-xs text-muted-foreground">All job requisitions are currently active or approved.</p>
          </div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="p-3.5 rounded-lg border border-border bg-card space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{draft.title}</span>
                    <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                      Draft • {draft.completionPercentage}% Complete
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{draft.departmentName}</span>
                </div>

                <Button size="sm" className="h-8 text-xs shrink-0" asChild>
                  <Link href={`/jobs/${draft.id}/edit`}>
                    Resume Setup <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${draft.completionPercentage}%` }}
                />
              </div>

              {/* Missing Setup Items */}
              {draft.missingSteps.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Missing items:</span>
                  {draft.missingSteps.map((step, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                      <AlertCircle className="h-3 w-3" />
                      {step}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
