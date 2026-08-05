"use client"

import * as React from "react"
import { 
  FileText, 
  Sparkles, 
  Trophy, 
  Video, 
  ShieldCheck,
  CheckCircle2,
  Circle,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecruitmentTimelineSection() {
  const steps = [
    {
      id: 1,
      step: "STEP 01",
      title: "Requisition & Form Setup",
      icon: FileText,
      description: "Create multi-round job requisitions and attach custom application questionnaires (visa, background checks, disclosures).",
      status: "Completed",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: 2,
      step: "STEP 02",
      title: "AI Pre-Screening",
      icon: Sparkles,
      description: "Candidates take automated Gemini AI voice interviews & backend/frontend coding tests without recruiter manual effort.",
      status: "Completed",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: 3,
      step: "STEP 03",
      title: "Top Merit Ranking",
      icon: Trophy,
      description: "AI grades candidate responses and populates the Top Merit Leaderboard with candidates scoring ≥ 80%.",
      status: "Active Stage",
      statusColor: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      id: 4,
      step: "STEP 04",
      title: "Live Pair-Coding Room",
      icon: Video,
      description: "Host live WebRTC video calls with integrated sub-50ms shared Monaco pair-coding editor and instant scorecards.",
      status: "Next Round",
      statusColor: "text-muted-foreground bg-muted border-border"
    },
    {
      id: 5,
      step: "STEP 05",
      title: "Approval & Onboarding",
      icon: ShieldCheck,
      description: "Route offer letters to VP approvals queue and send tokenized onboarding invitations upon sign-off.",
      status: "Final Stage",
      statusColor: "text-muted-foreground bg-muted border-border"
    }
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-20 border-b border-border/40 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            End-to-End Recruitment Flow
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How Dev-Center Streamlines Your Entire Hiring Workflow
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            From requisition creation to tokenized onboarding, see how every step connects seamlessly inside one ecosystem.
          </p>
        </div>

        {/* StepTimeline Integrated Pipeline Bar */}
        <div className="max-w-4xl mx-auto p-4 rounded-xl border border-border bg-card shadow-sm hidden md:block">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3 px-2">
            <span className="text-foreground">Recruitment Operating System Pipeline Progress</span>
            <span className="font-mono text-[11px] text-purple-500">Stage 3 of 5 Active</span>
          </div>

          <div className="flex items-center justify-between gap-2 px-2">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2 shrink-0">
                  {s.id < 3 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : s.id === 3 ? (
                    <div className="relative flex items-center justify-center h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75" />
                      <Circle className="h-3.5 w-3.5 text-purple-500 fill-purple-500/20 shrink-0" />
                    </div>
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${s.id === 3 ? 'text-purple-500 font-bold' : s.id < 3 ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full ${s.id < 3 ? 'bg-emerald-500' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Timeline Stage Cards Grid */}
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card 
                key={idx} 
                className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] max-w-md p-6 border-border/70 bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20">
                      {item.step}
                    </span>
                    <Badge variant="outline" className={`text-[10px] py-0.5 px-2 ${item.statusColor}`}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted border border-border/60 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
