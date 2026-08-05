"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CandidateStatusBadgeProps {
  status: string
  screeningScore?: number | null
  className?: string
  showScore?: boolean
}

export function CandidateStatusBadge({
  status,
  screeningScore,
  className,
  showScore = true,
}: CandidateStatusBadgeProps) {
  const normalized = status.toLowerCase()

  let badgeStyle = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"

  if (normalized.includes("hired") || normalized.includes("accepted")) {
    badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  } else if (normalized.includes("offer") || normalized.includes("pending")) {
    badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  } else if (normalized.includes("reject") || normalized.includes("declined")) {
    badgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
  } else if (normalized.includes("screen") || normalized.includes("review")) {
    badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  }

  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      {showScore && screeningScore !== null && screeningScore !== undefined && (
        <Badge
          variant="outline"
          className="py-1 px-2.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap shrink-0"
        >
          <Sparkles className="h-3 w-3 mr-1 shrink-0" /> AI Score: {screeningScore}%
        </Badge>
      )}

      <Badge
        variant="secondary"
        className={cn(
          "capitalize py-1 px-2.5 text-xs font-normal border whitespace-nowrap shrink-0",
          badgeStyle
        )}
      >
        {status}
      </Badge>
    </div>
  )
}
