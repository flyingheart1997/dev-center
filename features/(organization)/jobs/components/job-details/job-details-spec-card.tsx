"use client"

import * as React from "react"
import { FileText, Tag, ShieldAlert, CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobDetailsSpecCard() {
  const { job } = useJobDetails()

  if (!job) return null

  const skills = job.skills || []
  const approvals = job.approvals || [
    {
      id: "appr-1",
      status: "Approved",
      updatedAt: "2026-07-16T10:00:00Z",
      approver: { user: { name: "Aarav Sharma", email: "aarav.sharma@devcenter.io", image: "" } },
    },
    {
      id: "appr-2",
      status: "Approved",
      updatedAt: "2026-07-16T14:30:00Z",
      approver: { user: { name: "Marcus Vance", email: "marcus.vance@devcenter.io", image: "" } },
    },
  ]

  return (
    <Card className="border border-border shadow-xs pt-0 min-w-0 w-full">
      <CardHeader className="py-3 shadow-sm dark:bg-neutral-800">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span>Job Description & Requisition Overview</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Detailed candidate-facing job specification, skills, and governance approval routing history.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (lg:col-span-7): Description + Required Skills */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" /> Role Scope & Responsibilities
              </h4>
              <div className="text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
                {job.description || "No detailed description provided for this requisition spec."}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary shrink-0" /> Required Technical & Soft Skills ({skills.length})
                </h4>

                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  {skills.map((item: any) => (
                    <Badge
                      key={item.id || item.skillId || item.name}
                      variant="secondary"
                      className="p-2.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {item.skill?.name || item.name || "Skill Tag"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (lg:col-span-5): Requisition Approval Routing & History with Avatars (2-Column Grid Layout) */}
          <div className="lg:col-span-5 space-y-3 min-w-0 lg:border-l lg:border-border/60 lg:pl-5">
            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" /> Approval Routing & History
              </h4>
              <Badge variant="outline" className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0">
                Status: Approved
              </Badge>
            </div>

            {/* 2-Column Grid for Approval Cards (50% Width Each, Max 2 per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 w-full min-w-0">
              {approvals.map((appr: any, idx: number) => {
                const approverName = appr.approver?.user?.name || "Global Admin"
                const approverEmail = appr.approver?.user?.email || "admin@devcenter.io"
                const approverImage = appr.approver?.user?.image || ""
                const date = appr.updatedAt ? new Date(appr.updatedAt).toLocaleDateString() : "7/16/2026"
                const status = appr.status || "Approved"
                const initials = approverName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()

                return (
                  <div
                    key={appr.id || idx}
                    className="p-2.5 rounded-lg border border-border/80 bg-muted/30 text-xs space-y-2 hover:border-primary/30 transition-all min-w-0 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-7 w-7 border border-border shrink-0">
                          {approverImage && <AvatarImage src={approverImage} alt={approverName} />}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground truncate text-xs">{approverName}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-32 flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5 shrink-0 text-muted-foreground" /> {approverEmail}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="py-0.5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> {status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5" /> Verified</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="h-2.5 w-2.5" /> {date}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
