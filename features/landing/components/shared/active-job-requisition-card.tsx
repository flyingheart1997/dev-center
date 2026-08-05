"use client"

import * as React from "react"
import { MapPin, User, Calendar, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ActiveJobRequisitionProps {
  title: string
  department: string
  location: string
  createdBy: string
  postedDate: string
  applicantsCount: number
  className?: string
}

export function ActiveJobRequisitionCard({
  title,
  department,
  location,
  createdBy,
  postedDate,
  applicantsCount,
  className,
}: ActiveJobRequisitionProps) {
  return (
    <Card className={cn("p-4 border border-border bg-card hover:border-primary/40 transition-all text-left shadow-xs space-y-3", className)}>
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="space-y-1.5 min-w-0 flex-1">
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
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" /> Posted {postedDate}
            </span>
          </div>
        </div>

        <Badge variant="secondary" className="text-xs font-semibold py-1 px-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
          <Users className="h-3.5 w-3.5 mr-1 text-purple-500" /> {applicantsCount} Applicants
        </Badge>
      </div>
    </Card>
  )
}
