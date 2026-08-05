"use client"

import * as React from "react"
import {
  Briefcase,
  Users,
  Video,
  Clock,
  TrendingUp,
  Sparkles,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building2,
  FileEdit
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CandidateEvaluationRowCard } from "./shared/candidate-evaluation-row-card"
import { DraftRequisitionCard } from "./shared/draft-requisition-card"
import { FadeInWhenVisible, ParallaxGlow } from "./landing-motion"

export function DashboardPipelineVisualizer() {
  return (
    <section id="ats-pipeline" className="relative py-16 md:py-20 border-b border-border/40 overflow-hidden">
      <ParallaxGlow offset={70} className="w-125 h-125 bg-blue-500/10 top-[20%] -left-25" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        {/* Section Header */}
        <FadeInWhenVisible delay={0}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              <Building2 className="h-3.5 w-3.5 mr-1 text-primary" />
              Enterprise Organization Dashboard
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Complete Control Over Jobs, AI Screenings & Live Interview Rooms
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Experience our actual Organization Dashboard. Monitor real-time candidate merit scores, manage multi-department job requisitions, and review pending approval queues.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Real Product Organization Dashboard Visualizer */}
        <FadeInWhenVisible distance={40} delay={0.2} className="w-full rounded-xl border border-border/80 bg-card shadow-2xl overflow-hidden">

          {/* Top Browser Window Bar with Traffic Lights (Image 2 style) */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/60 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block shadow-xs" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline-block">app.dev-center.io/workspace</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-background/40 space-y-6">

            {/* ROW 1: 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-blue-500/5 p-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">18</span>
                        <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <TrendingUp className="h-2.5 w-2.5" /> +12%
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate mt-0.5">Active Job Requisitions</span>
                      <span className="text-[10px] text-muted-foreground truncate font-normal">2 Drafts in setup</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-1 shrink-0 h-6 border-l border-border/40 pl-3">
                    <div className="w-1 rounded-full h-2 bg-blue-500/25" />
                    <div className="w-1 rounded-full h-4 bg-blue-500/45" />
                    <div className="w-1 rounded-full h-3 bg-blue-500/35" />
                    <div className="w-1 rounded-full h-5 bg-blue-500/65" />
                    <div className="w-1 rounded-full h-6 bg-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-emerald-500/5 p-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">94</span>
                        <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <Sparkles className="h-2.5 w-2.5" /> +18%
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate mt-0.5">Pipeline Candidates</span>
                      <span className="text-[10px] text-muted-foreground truncate font-normal">78% AI Screening Pass Rate</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-1 shrink-0 h-6 border-l border-border/40 pl-3">
                    <div className="w-1 rounded-full h-2 bg-emerald-500/25" />
                    <div className="w-1 rounded-full h-4 bg-emerald-500/45" />
                    <div className="w-1 rounded-full h-3 bg-emerald-500/35" />
                    <div className="w-1 rounded-full h-5 bg-emerald-500/65" />
                    <div className="w-1 rounded-full h-6 bg-emerald-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-purple-500/5 p-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">6</span>
                        <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-purple-500/10 text-purple-500 border-purple-500/20">
                          <Clock className="h-2.5 w-2.5" /> Today
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate mt-0.5">Scheduled Interviews</span>
                      <span className="text-[10px] text-muted-foreground truncate font-normal">LiveKit Video Rooms Ready</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-1 shrink-0 h-6 border-l border-border/40 pl-3">
                    <div className="w-1 rounded-full h-3 bg-purple-500/25" />
                    <div className="w-1 rounded-full h-2 bg-purple-500/35" />
                    <div className="w-1 rounded-full h-5 bg-purple-500/55" />
                    <div className="w-1 rounded-full h-4 bg-purple-500/70" />
                    <div className="w-1 rounded-full h-6 bg-purple-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-amber-500/5 p-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground leading-tight tracking-tight">3</span>
                        <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 shrink-0 flex items-center gap-0.5 bg-amber-500/10 text-amber-500 border-amber-500/20">
                          <AlertCircle className="h-2.5 w-2.5" /> Action Req
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate mt-0.5">Pending Approvals</span>
                      <span className="text-[10px] text-muted-foreground truncate font-normal">Sign-off Action Required</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-1 shrink-0 h-6 border-l border-border/40 pl-3">
                    <div className="w-1 rounded-full h-2 bg-amber-500/25" />
                    <div className="w-1 rounded-full h-3 bg-amber-500/35" />
                    <div className="w-1 rounded-full h-4 bg-amber-500/55" />
                    <div className="w-1 rounded-full h-5 bg-amber-500/75" />
                    <div className="w-1 rounded-full h-6 bg-amber-500" />
                  </div>
                </div>
              </Card>

            </div>

            {/* ROW 2: Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* LEFT OPERATIONAL SECTION (8 cols): Draft Requisitions & Candidate Evaluations */}
              <div className="lg:col-span-8 space-y-5">

                {/* 1. Incomplete Draft Requisitions (Matching Image 4) */}
                <Card className="border border-border shadow-xs pt-0 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/50 bg-muted/20">
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <FileEdit className="w-4 h-4 text-amber-500 shrink-0" />
                        Incomplete Draft Requisitions
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Jobs requiring setup completion before publishing or submitting for approval
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 gap-1">
                      View All <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-3.5 space-y-3">
                    <DraftRequisitionCard
                      title="Staff Security Engineer"
                      department="Cybersecurity"
                      location="Headquarters (Hybrid)"
                      createdBy="Aarav Sharma"
                      steps={[
                        { id: 1, label: "Basic Info", isCompleted: true },
                        { id: 2, label: "Department & Location", isCompleted: true },
                        { id: 3, label: "Interview Rounds", isActive: true, subRounds: 3 },
                        { id: 4, label: "Compensation & Perks" },
                        { id: 5, label: "Approval & Publish" },
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* 2. Recent Candidate Evaluations (Matching Image 4) */}
                <Card className="border border-border shadow-xs pt-0 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/50 bg-muted/20">
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        Recent Candidate Evaluations
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Latest candidate applications processed by AI Voice & Virtual Compiler
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 gap-1">
                      View All <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-3.5 space-y-3">
                    <CandidateEvaluationRowCard
                      name="Alex Rivera"
                      email="alex.rivera@example.com"
                      role="Senior Full-Stack Engineer"
                      department="Engineering"
                      appliedDate="7/27/2026"
                      aiScore={94}
                      statusBadge="Screening Passed"
                      statusVariant="purple"
                      steps={[
                        { id: 1, label: "Pre-Screening & Applied", isActive: true },
                        { id: 2, label: "Recruiter Review" },
                        { id: 3, label: "Interview Rounds", subRounds: 3 },
                        { id: 4, label: "Offer & Negotiation" },
                        { id: 5, label: "Hired" },
                      ]}
                    />
                  </CardContent>
                </Card>

              </div>

              {/* RIGHT ACTION SIDEBAR (4 cols): Scheduled Interviews & Approvals */}
              <div className="lg:col-span-4 space-y-5">
                <Card className="border border-border shadow-xs pt-0 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/50 bg-muted/20">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Video className="w-4 h-4 text-purple-500 shrink-0" />
                      Scheduled Live Interviews
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">Today</Badge>
                  </CardHeader>

                  <CardContent className="p-3.5 space-y-3 text-xs">
                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-3 text-left">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-foreground">Sophia Chen (Candidate)</div>
                        <div className="text-xs text-muted-foreground">AI / ML Systems Architect · Round 2</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-mono">Today 8:44 PM</span>
                        <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5">
                          <Video className="h-3.5 w-3.5" /> Join Room
                        </Button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-3 text-left">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-foreground">Alex Rivera (Candidate)</div>
                        <div className="text-xs text-muted-foreground">Senior Full-Stack Engineer · Round 3</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-mono">Today 11:44 PM</span>
                        <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5">
                          <Video className="h-3.5 w-3.5" /> Join Room
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>

          </div>
        </FadeInWhenVisible>

      </div>
    </section>
  )
}
