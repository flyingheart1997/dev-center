"use client"

import * as React from "react"
import { MapPin, User, FileEdit, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DashboardTimelineNodes, TimelineNodeStep } from "./dashboard-timeline-nodes"

export interface DraftRequisitionProps {
  title: string
  department: string
  location: string
  createdBy: string
  steps: TimelineNodeStep[]
  className?: string
}

export function DraftRequisitionCard({
  title,
  department,
  location,
  createdBy,
  steps,
  className,
}: DraftRequisitionProps) {
  return (
    <Card className={cn("group relative p-4 border border-border bg-card space-y-3.5 hover:border-primary/40 transition-all text-left shadow-xs overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-sm text-foreground truncate">{title}</h4>
            <Badge variant="outline" className="text-[10px] py-0 px-2 font-normal border-border bg-muted/40">
              {department}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" /> {location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 shrink-0" /> Created by: <strong className="text-foreground/90 font-medium">{createdBy}</strong>
            </span>
          </div>
        </div>

        {/* Top-Right Badge <-> Button Swap Container */}
        <div className="relative shrink-0 self-center flex items-center justify-end">
          <Badge
            variant="outline"
            className="text-[10px] font-medium py-1 px-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shrink-0 transition-all duration-200 group-hover:opacity-0 group-hover:scale-95 group-hover:pointer-events-none"
          >
            Draft Requisition
          </Badge>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto flex items-center">
            <Button variant="outline" size="sm" className="h-7 text-xs font-semibold gap-1 border-amber-500/40 bg-background hover:bg-muted text-amber-600 dark:text-amber-400 shadow-xs">
              <FileEdit className="h-3.5 w-3.5 text-amber-500" /> Resume Setup <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 5-Step Draft Requisition Setup Timeline */}
      <DashboardTimelineNodes steps={steps} accentColor="amber" />
    </Card>
  )
}
