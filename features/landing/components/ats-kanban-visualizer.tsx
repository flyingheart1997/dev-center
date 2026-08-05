"use client"

import * as React from "react"
import { Briefcase, ArrowRight, MoreVertical, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ATSKanbanVisualizer() {
  const columns = [
    {
      title: "Applied",
      count: 24,
      candidates: [
        { name: "Sarah Jenkins", role: "Sr. React Engineer", score: "92%", stage: "Form Complete", avatar: "SJ" },
        { name: "Rahul Sharma", role: "Full Stack Dev", score: "88%", stage: "Form Complete", avatar: "RS" }
      ]
    },
    {
      title: "AI Screening Passed",
      count: 12,
      candidates: [
        { name: "David Chen", role: "Backend Go Engineer", score: "96%", stage: "Merit 96/100", avatar: "DC" },
        { name: "Elena Rostova", role: "DevOps Engineer", score: "94%", stage: "Merit 94/100", avatar: "ER" }
      ]
    },
    {
      title: "Live Technical Round",
      count: 5,
      candidates: [
        { name: "Alex Rivera", role: "Staff Engineer", score: "98%", stage: "Scheduled 4 PM", avatar: "AR" }
      ]
    },
    {
      title: "Offer Approved",
      count: 3,
      candidates: [
        { name: "Maya Patel", role: "Lead Product Designer", score: "95%", stage: "Offer Sent", avatar: "MP" }
      ]
    }
  ]

  return (
    <section id="ats-pipeline" className="py-16 md:py-20 border-b border-border/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            <Briefcase className="h-3.5 w-3.5 mr-1" />
            Enterprise ATS & Kanban Engine
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Manage Every Applicant in a Drag-and-Drop Kanban Pipeline
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Multi-tenant isolated pipelines per Business Unit, Branch, or Department. Filter by AI Merit Score and track application stages.
          </p>
        </div>

        {/* Interactive ATS Kanban Visualizer */}
        <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xl space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-foreground">Position: Senior Software Engineer</span>
              <Badge variant="secondary" className="text-[10px]">18 Applicants</Badge>
            </div>

            <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Candidate
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {columns.map((col, idx) => (
              <div key={idx} className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{col.title}</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-mono">
                      {col.count}
                    </Badge>
                  </div>
                  <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  {col.candidates.map((cand, cIdx) => (
                    <Card
                      key={cIdx}
                      className="p-3 bg-card shadow-none border-border/70 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-border">
                            <AvatarFallback className="text-[9px] font-bold bg-muted">{cand.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-xs text-foreground">{cand.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {cand.score}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-muted-foreground">{cand.role}</p>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>{cand.stage}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </Card>

      </div>
    </section>
  )
}
