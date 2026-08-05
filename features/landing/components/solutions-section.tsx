"use client"

import * as React from "react"
import { Building2, Code2, Users, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SolutionsSection() {
  const personas = [
    {
      title: "For Enterprise HR Leaders",
      icon: Building2,
      description: "Complete governance and compliance control across multi-tier organization hierarchies.",
      points: [
        "Multi-Tenant Isolation (Business Units, Branches, Departments)",
        "Granular RBAC Roles (Owner, Admin, Recruiter, Interviewer)",
        "Audit Logs & Security Compliance Tracking",
        "Unified Enterprise Billing & Job Quotas"
      ]
    },
    {
      title: "For Tech Hiring Managers",
      icon: Code2,
      description: "Automate technical pre-screening and run collaborative live coding interviews.",
      points: [
        "Zero-Effort Gemini AI Voice & Coding Screening",
        "Real-Time Collaborative WebRTC Pair-Coding Rooms",
        "Instant Candidate Merit Ranking & Scorecards",
        "Multi-Round Requisition Approval Queues"
      ]
    },
    {
      title: "For Job Candidates & Seekers",
      icon: Users,
      description: "A transparent, AI-empowered career hub that accelerates job discovery.",
      points: [
        "AI-Powered Resume Parsing & Job Recommendations",
        "Real-Time Application Status & Stage Tracking",
        "Mock AI Voice Interview Practice Arena",
        "Seamless Draft Application Auto-Save"
      ]
    }
  ]

  return (
    <section id="solutions" className="py-16 md:py-20 border-b border-border/40 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Tailored Solutions
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built for Everyone in the Hiring Ecosystem
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Whether managing enterprise HR compliance or interviewing senior software engineers, Dev-Center provides a tailored experience for your role.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="p-6 border-border/70 bg-card shadow-none space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-2.5 rounded-lg bg-muted border border-border/60 w-fit">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/40">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90 font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
