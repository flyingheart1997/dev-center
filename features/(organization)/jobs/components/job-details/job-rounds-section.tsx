"use client"

import * as React from "react"
import { Layers, Sparkles, Terminal, Video, Clock, Users, CheckCircle2, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobRoundsSection() {
  const { job } = useJobDetails()

  if (!job) return null

  const rounds = job.rounds || []

  if (rounds.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed border-border/80 space-y-3">
        <div className="h-10 w-10 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
          <Layers className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-foreground">No Assessment Rounds Configured</h4>
          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
            This requisition has not configured evaluation pipeline rounds yet.
          </p>
        </div>
      </Card>
    )
  }

  const roundCategoryBadge = (category: string) => {
    const catLower = (category || "").toLowerCase()
    if (catLower.includes("screen")) {
      return { label: "AI Pre-Screening", icon: Sparkles, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" }
    } else if (catLower.includes("tech") || catLower.includes("code")) {
      return { label: "Technical & Compiler", icon: Terminal, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" }
    } else if (catLower.includes("design") || catLower.includes("arch")) {
      return { label: "System Design", icon: Layers, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" }
    } else if (catLower.includes("management") || catLower.includes("culture") || catLower.includes("hr")) {
      return { label: "Culture & HR Fit", icon: CheckCircle2, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" }
    }
    return { label: category || "Interview Stage", icon: Video, className: "bg-muted text-muted-foreground border-border" }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-primary" /> Evaluation & Assessment Pipeline Rounds ({rounds.length})
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Sequential multi-stage evaluation pipeline configured for candidate screening and interviews.
        </p>
      </div>

      {/* Max 2 Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {rounds.map((round: any, idx: number) => {
          const badgeConfig = roundCategoryBadge(round.category)
          const BadgeIcon = badgeConfig.icon
          const interviewers = round.interviewers || []
          const stageNumber = round.orderIndex !== undefined ? round.orderIndex + 1 : idx + 1

          // Extract clean round name if title contains "Round X: Name"
          let roundName = round.title || `Stage ${stageNumber}`
          if (roundName.includes(":")) {
            roundName = roundName.split(":")[1].trim()
          }

          return (
            <Card
              key={round.id || idx}
              className="border border-border/80 shadow-2xs bg-card space-y-3 p-3.5 hover:border-primary/40 transition-all flex flex-col justify-between min-w-0"
            >
              <div className="space-y-2.5 min-w-0">
                {/* Header Group: Top Row (No Border) + Directly Below = Round Name */}
                <div className="space-y-1.5 min-w-0">
                  {/* Row 1: Left = Round Avatar (#1) + "Round 1" + Round Time, Right = Category Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      {/* 1. Round Avatar Number */}
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center border border-primary/20 shrink-0">
                        #{stageNumber}
                      </div>

                      {/* 2. Round Label */}
                      <span className="font-bold text-xs text-foreground shrink-0">
                        Round {stageNumber}
                      </span>

                      <span className="text-[11px] text-muted-foreground/60 shrink-0">•</span>

                      {/* 3. Round Time (Duration) */}
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {round.durationMinutes || 45} mins
                      </span>
                    </div>

                    {/* End of Row 1: Category Badge */}
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1 shrink-0", badgeConfig.className)}
                    >
                      <BadgeIcon className="h-3 w-3" />
                      {badgeConfig.label}
                    </Badge>
                  </div>

                  {/* Row 2: DIRECTLY below Row 1 (WITHOUT any border line) = Round Name */}
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground wrap-break-word min-w-0">
                      {roundName}
                    </h4>
                  </div>
                </div>

                {/* Assigned Panel Interviewers Spotlight (2-Column Grid = 50% width per card, max 2 per row) */}
                <div className="space-y-1.5 pt-2 border-t border-border/40 min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary shrink-0" /> Panel ({interviewers.length})
                  </span>

                  {interviewers.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground italic block">
                      Automated AI Evaluation Panel
                    </span>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
                      {interviewers.map((item: any) => {
                        const empUser = item.employee?.user
                        const name = empUser?.name || "Interviewer"
                        const email =
                          empUser?.email ||
                          `${name.toLowerCase().replace(/ /g, ".")}@devcenter.io`
                        const image = empUser?.image || ""
                        const initials = name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()

                        return (
                          <div
                            key={item.id || empUser?.id || name}
                            className="flex items-center gap-2 p-2 rounded-lg border border-border/80 bg-muted/30 text-xs w-full min-w-0"
                          >
                            <Avatar className="h-7 w-7 border border-border shrink-0">
                              {image && <AvatarImage src={image} alt={name} />}
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                                {initials}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-semibold text-foreground truncate text-xs">
                                {name}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                                <Mail className="h-2.5 w-2.5 shrink-0 text-muted-foreground" /> {email}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
