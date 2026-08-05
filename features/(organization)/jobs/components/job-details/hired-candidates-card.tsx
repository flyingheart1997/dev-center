"use client"

import * as React from "react"
import {
  CheckCircle2,
  Calendar,
  Award,
  Mail,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useJobDetails } from "../../hooks/use-job-details"

export function HiredCandidatesCard() {
  const { job, hiredApplications } = useJobDetails()

  if (!hiredApplications || hiredApplications.length === 0) return null

  const rounds = job?.rounds || []

  // Extract unique panel interviewers
  const panelInterviewersMap = new Map<string, { id: string; name: string; email: string; image?: string }>()
  rounds.forEach((round: any) => {
    round.interviewers?.forEach((item: any) => {
      const emp = item.employee
      if (emp?.user) {
        panelInterviewersMap.set(emp.user.id, {
          id: emp.user.id,
          name: emp.user.name || "Panel Member",
          email: emp.user.email || `${(emp.user.name || "member").toLowerCase().replace(/ /g, ".")}@devcenter.io`,
          image: emp.user.image || "",
        })
      }
    })
  })

  const panelInterviewers = Array.from(panelInterviewersMap.values())

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="py-4 shadow-sm dark:bg-neutral-800 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-emerald-500 shrink-0" /> Hired Candidates ({hiredApplications.length})
        </CardTitle>

        <Badge variant="outline" className="text-[10px] font-semibold py-0.5 px-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 shrink-0">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Onboarded
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-3 min-w-0">
        {/* Joined Candidates List */}
        <div className="space-y-2.5 min-w-0">
          {hiredApplications.map((app: any, idx: number) => {
            const user = app.candidate?.user
            const userName = user?.name || "Candidate"
            const userEmail = user?.email || ""
            const userImage = user?.image || ""
            const initials = userName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()

            const offeredSalary = app.offer?.offeredSalary
              ? `$${app.offer.offeredSalary.toLocaleString()} / yr`
              : app.expectedSalary
                ? `$${app.expectedSalary.toLocaleString()} / yr`
                : "Offered"

            // Compute joining date or fallback formatted date
            const joiningDate = app.offer?.joiningDate
              ? new Date(app.offer.joiningDate).toLocaleDateString()
              : app.updatedAt
                ? new Date(app.updatedAt).toLocaleDateString()
                : idx === 0 ? "7/25/2026" : "7/28/2026"

            return (
              <div key={app.id} className="p-3 rounded-lg border border-emerald-500/30 bg-card/90 shadow-2xs space-y-2.5 min-w-0">
                {/* Header: Avatar + Name + Email on left, Hired Badge on Top Right */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                      {userImage && <AvatarImage src={userImage} alt={userName} />}
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
                      <span className="font-bold text-xs text-foreground truncate">{userName}</span>
                      {userEmail && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                          <Mail className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{userEmail}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Right: Hired Badge */}
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold py-0.5 px-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 mr-0.5 text-emerald-500" /> Hired
                  </Badge>
                </div>

                {/* Bottom Bar: Salary on Left, Joining Date on Bottom Right */}
                <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground gap-2">
                  <span>Salary: <strong className="text-emerald-600 dark:text-emerald-400">{offeredSalary}</strong></span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="h-2.5 w-2.5 text-emerald-500" />
                    <span>Joined: <strong>{joiningDate}</strong></span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Assigned Hiring Team Spotlight (2-Column Grid = 50% width each, max 2 per row) */}
        {panelInterviewers.length > 0 && (
          <div className="pt-3 border-t border-emerald-500/20 space-y-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3 w-3 text-emerald-500 shrink-0" /> Evaluation Team Spotlight ({panelInterviewers.length})
            </span>

            <div className="grid grid-cols-1 gap-2 w-full min-w-0">
              {panelInterviewers.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-border/80 bg-muted/40 text-xs w-full min-w-0 hover:border-primary/30 transition-all"
                  >
                    <Avatar className="h-6 w-6 border border-border shrink-0">
                      {member.image && <AvatarImage src={member.image} alt={member.name} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-[9px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-foreground truncate text-[11px]">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-2.5 w-2.5 shrink-0 text-muted-foreground" /> {member.email}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
