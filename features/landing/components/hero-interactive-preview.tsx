"use client"

import * as React from "react"
import {
  Briefcase,
  Sparkles,
  Video,
  Check,
  Mic,
  Code2,
  Star,
  LayoutDashboard,
  Share2,
  PhoneOff,
  FileText,
  Users,
  MessageSquare,
  Lock,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CandidateEvaluationRowCard } from "./shared/candidate-evaluation-row-card"
import { DraftRequisitionCard } from "./shared/draft-requisition-card"

export function HeroInteractivePreview() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "ai-screening" | "live-interview">("dashboard")

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl border border-border/80 bg-card shadow-2xl overflow-hidden">

      {/* Browser Top Window Bar with Traffic Lights (Image 2 style) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/60 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block shadow-xs" />
          <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block shadow-xs" />
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block shadow-xs" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline-block">app.dev-center.io/workspace</span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border/60">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("dashboard")}
            className="h-7 text-[11px] font-medium px-2.5 rounded-md"
          >
            <LayoutDashboard className="h-3 w-3 mr-1 text-primary" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "ai-screening" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ai-screening")}
            className="h-7 text-[11px] font-medium px-2.5 rounded-md"
          >
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            AI Screening
          </Button>

          <Button
            variant={activeTab === "live-interview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("live-interview")}
            className="h-7 text-[11px] font-medium px-2.5 rounded-md"
          >
            <Video className="h-3 w-3 mr-1 text-primary" />
            Live Room
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Platform
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-3 sm:p-4 bg-background/50">

        {/* VIEW 1: Real Organization Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-3.5 animate-in fade-in-50 duration-200">



            {/* 4 KPI Summary Cards with Sparklines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-blue-500/5 p-3">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-foreground leading-tight">18</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20">+12%</Badge>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground truncate">Active Job Requisitions</span>
                      <span className="text-[9px] text-muted-foreground truncate font-normal">2 Drafts in setup</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-0.5 shrink-0 h-5 border-l border-border/40 pl-2">
                    <div className="w-0.5 rounded-full h-1.5 bg-blue-500/25" />
                    <div className="w-0.5 rounded-full h-3 bg-blue-500/45" />
                    <div className="w-0.5 rounded-full h-2 bg-blue-500/35" />
                    <div className="w-0.5 rounded-full h-4 bg-blue-500/65" />
                    <div className="w-0.5 rounded-full h-5 bg-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-emerald-500/5 p-3">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-foreground leading-tight">94</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20">+18%</Badge>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground truncate">Pipeline Candidates</span>
                      <span className="text-[9px] text-muted-foreground truncate font-normal">78% AI Pass Rate</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-0.5 shrink-0 h-5 border-l border-border/40 pl-2">
                    <div className="w-0.5 rounded-full h-1.5 bg-emerald-500/25" />
                    <div className="w-0.5 rounded-full h-3 bg-emerald-500/45" />
                    <div className="w-0.5 rounded-full h-2 bg-emerald-500/35" />
                    <div className="w-0.5 rounded-full h-4 bg-emerald-500/65" />
                    <div className="w-0.5 rounded-full h-5 bg-emerald-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-purple-500/5 p-3">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Video className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-foreground leading-tight">6</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 font-medium bg-purple-500/10 text-purple-500 border-purple-500/20">Today</Badge>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground truncate">Scheduled Interviews</span>
                      <span className="text-[9px] text-muted-foreground truncate font-normal">LiveKit Rooms Ready</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-0.5 shrink-0 h-5 border-l border-border/40 pl-2">
                    <div className="w-0.5 rounded-full h-2 bg-purple-500/25" />
                    <div className="w-0.5 rounded-full h-1.5 bg-purple-500/35" />
                    <div className="w-0.5 rounded-full h-4 bg-purple-500/55" />
                    <div className="w-0.5 rounded-full h-3 bg-purple-500/70" />
                    <div className="w-0.5 rounded-full h-5 bg-purple-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-border shadow-xs bg-linear-to-br from-card via-card to-amber-500/5 p-3">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-foreground leading-tight">3</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 font-medium bg-amber-500/10 text-amber-500 border-amber-500/20">Action Req</Badge>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground truncate">Pending Approvals</span>
                      <span className="text-[9px] text-muted-foreground truncate font-normal">Sign-off Action Required</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-end gap-0.5 shrink-0 h-5 border-l border-border/40 pl-2">
                    <div className="w-0.5 rounded-full h-1.5 bg-amber-500/25" />
                    <div className="w-0.5 rounded-full h-2 bg-amber-500/35" />
                    <div className="w-0.5 rounded-full h-3 bg-amber-500/55" />
                    <div className="w-0.5 rounded-full h-4 bg-amber-500/75" />
                    <div className="w-0.5 rounded-full h-5 bg-amber-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* 2-Column Operational Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

              {/* Left Column (8 cols): Draft Requisitions & Candidate Evaluations */}
              <div className="md:col-span-8 space-y-3">
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
              </div>

              {/* Right Column (4 cols): Scheduled Interviews & Approvals */}
              <div className="md:col-span-4 space-y-3">
                <Card className="border border-border shadow-xs pt-0 bg-card">
                  <CardHeader className="py-2 border-b border-border/50 bg-muted/20">
                    <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                      <Video className="w-3.5 h-3.5 text-purple-500" /> Scheduled Live
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-2.5 text-xs space-y-2 text-left">
                    <div className="p-2.5 rounded-lg border border-border bg-card space-y-2">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-xs text-foreground truncate">Sophia Chen (Candidate)</div>
                        <div className="text-[10px] text-muted-foreground">Round 2: AI / ML Systems</div>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground font-mono">Today 8:44 PM</span>
                        <Button size="xs" className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1">
                          <Video className="h-3 w-3" /> Join Room
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: AI Voice & Compiler Screening */}
        {activeTab === "ai-screening" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">

            <Card className="p-4 border-border/70 shadow-none space-y-3 bg-card">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Gemini AI Voice Interview</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Score: 96/100</Badge>
              </div>

              <div className="bg-muted/40 p-3 rounded-lg space-y-2 border border-border/40">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Question 3 of 5: System Design</span>
                  <span className="font-mono">01:42 / 03:00</span>
                </div>

                {/* Vibrant High-Contrast Voice Waveform */}
                <div className="h-12 bg-zinc-950 border border-purple-500/30 rounded-lg p-2.5 flex items-center justify-center gap-1 overflow-hidden shadow-inner">
                  {[35, 65, 45, 85, 95, 60, 40, 75, 90, 100, 80, 50, 70, 95, 65, 85, 40, 75, 90, 60, 45, 80, 100, 70].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-500 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.7)]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground italic border-l-2 border-primary/50 pl-2">
                  &ldquo;I designed microservices using Kafka message queues and Redis distributed caching for sub-10ms latency.&rdquo;
                </p>
              </div>
            </Card>

            <Card className="p-4 border-border/70 shadow-none space-y-3 bg-card">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Virtual Compiler Execution</span>
                </div>
                <Badge variant="outline" className="text-[10px]">All Passed</Badge>
              </div>

              <div className="bg-zinc-950 text-zinc-100 p-3 rounded-lg text-[11px] font-mono space-y-1 text-left">
                <div className="text-zinc-500"># Python Solution: Two Sum Optimization</div>
                <div><span className="text-purple-400">def</span> <span className="text-blue-400">two_sum</span>(nums, target):</div>
                <div className="pl-4">seen = &#123;&#125;</div>
                <div className="pl-4"><span className="text-purple-400">for</span> i, n <span className="text-purple-400">in</span> enumerate(nums):</div>
                <div className="pl-8">diff = target - n</div>
                <div className="pl-8"><span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> seen: <span className="text-purple-400">return</span> [seen[diff], i]</div>
                <div className="pl-8">seen[n] = i</div>
              </div>

              <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg text-xs">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> TestCase 1: [2, 7, 11, 15], Target 9
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">Passed (0.4ms)</span>
              </div>
            </Card>

          </div>
        )}

        {/* VIEW 3: Live WebRTC Interview Room */}
        {activeTab === "live-interview" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden font-sans animate-in fade-in-50 duration-200">

            {/* Top Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-zinc-200">Live Interview Room #804</span>
                <span className="text-zinc-500 text-[10px]">· Senior Frontend Engineer</span>
              </div>
              <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-300 bg-zinc-800/60">
                <Lock className="h-2.5 w-2.5 mr-1 text-emerald-400" /> LiveKit Encrypted
              </Badge>
            </div>

            {/* 3 Column Grid */}
            <div className="p-2.5 grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-zinc-950">

              {/* Left Column (3 cols): Problem Statement */}
              <div className="md:col-span-3 bg-zinc-900/80 rounded-lg p-2.5 border border-zinc-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-200">
                      <FileText className="h-3 w-3 text-primary" /> Problem Statement
                    </div>
                    <Badge variant="outline" className="text-[8px] border-amber-500/40 text-amber-400">Medium</Badge>
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-100">1. Implement LRU Cache</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity.
                  </p>
                </div>
                <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] text-zinc-400 flex items-center justify-between">
                  <span>Test Cases:</span>
                  <span className="text-emerald-400 font-mono font-bold">2/2 Passed</span>
                </div>
              </div>

              {/* Center Column (6 cols): Shared Monaco Editor */}
              <div className="md:col-span-6 bg-zinc-900/90 rounded-lg border border-zinc-800 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-950/90 border-b border-zinc-800 text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-zinc-200">
                    <Code2 className="h-3 w-3 text-blue-400" />
                    <span>solution.tsx</span>
                  </div>
                  <span className="text-emerald-400 text-[9px] font-mono">50ms Live Sync</span>
                </div>

                <div className="p-2.5 font-mono text-[10px] leading-relaxed text-zinc-200 space-y-1 overflow-x-auto">
                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">1</span>
                    <span className="text-zinc-500">// Task: Implement LRU Cache with O(1) ops</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">2</span>
                    <div><span className="text-purple-400">export class</span> <span className="text-blue-400">LRUCache</span> &#123;</div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">3</span>
                    <div className="pl-3">private capacity: number;</div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">4</span>
                    <div className="pl-3">private cache: Map&lt;number, number&gt;;</div>
                  </div>

                  <div className="flex gap-2 bg-emerald-500/10 -mx-2.5 px-2.5 py-0.5 rounded border-l-2 border-emerald-500">
                    <span className="text-zinc-600 select-none w-3 text-right">5</span>
                    <div className="pl-3 relative flex items-center gap-1">
                      <span className="text-purple-400">get</span>(key: number): number &#123;
                      <span className="bg-emerald-500 text-black text-[8px] px-1 rounded font-sans font-bold ml-1 animate-pulse">
                        David (Candidate)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">6</span>
                    <div className="pl-6">if (!this.cache.has(key)) return -1;</div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-zinc-600 select-none w-3 text-right">7</span>
                    <div>&#125;</div>
                  </div>
                </div>

                <div className="px-2.5 py-1.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">Scorecard:</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-white ml-1 font-mono">5.0 Strong Hire</span>
                  </div>
                </div>
              </div>

              {/* Right Column (3 cols): Joined Users & Video */}
              <div className="md:col-span-3 bg-zinc-900/80 rounded-lg p-2 border border-zinc-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-200">
                      <Users className="h-3 w-3 text-primary" /> Joined Users (2)
                    </div>
                  </div>

                  <div className="relative aspect-video rounded bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-zinc-800 text-white font-bold text-[9px]">HM</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0.5 left-1 bg-black/70 px-1 rounded text-[8px] text-zinc-300">
                      Interviewer (You)
                    </div>
                  </div>

                  <div className="relative aspect-video rounded bg-zinc-950 border border-emerald-500/50 ring-1 ring-emerald-500/30 overflow-hidden flex items-center justify-center">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-zinc-800 text-emerald-400 font-bold text-[9px]">DC</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0.5 left-1 bg-black/70 px-1 rounded text-[8px] text-zinc-300">
                      David Chen
                    </div>
                    <span className="absolute top-0.5 right-1 px-1 rounded bg-emerald-500/20 text-emerald-400 text-[7px] font-mono">
                      Speaking
                    </span>
                  </div>
                </div>

                <div className="p-1.5 bg-zinc-950 rounded border border-zinc-800 text-[9px] text-zinc-400 flex items-center justify-between">
                  <span>Quality:</span>
                  <span className="text-emerald-400 font-medium">HD 1080p</span>
                </div>
              </div>

            </div>

            {/* Bottom Full-Width Meeting Control Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-zinc-900 border-t border-zinc-800 text-[10px]">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>LiveKit Audio & Video Stream Active</span>
              </div>

              <div className="flex items-center gap-1">
                <Button size="xs" variant="ghost" className="h-6 px-2 text-[10px] text-zinc-300 hover:text-white bg-zinc-800/80">
                  <Mic className="h-2.5 w-2.5 mr-1" /> Mute
                </Button>
                <Button size="xs" variant="ghost" className="h-6 px-2 text-[10px] text-zinc-300 hover:text-white bg-zinc-800/80">
                  <Video className="h-2.5 w-2.5 mr-1" /> Camera
                </Button>
                <Button size="xs" variant="ghost" className="h-6 px-2 text-[10px] text-zinc-300 hover:text-white bg-zinc-800/80">
                  <Share2 className="h-2.5 w-2.5 mr-1" /> Share
                </Button>
                <Button size="xs" variant="ghost" className="h-6 px-2 text-[10px] text-zinc-300 hover:text-white bg-zinc-800/80">
                  <MessageSquare className="h-2.5 w-2.5 mr-1" /> Chat
                </Button>
                <Button size="xs" className="h-6 px-2.5 text-[10px] bg-red-600 hover:bg-red-700 text-white font-semibold gap-1 ml-0.5">
                  <PhoneOff className="h-2.5 w-2.5" /> End Call
                </Button>
              </div>

              <div className="hidden sm:block text-[9px] text-zinc-400 font-mono">
                Dev-Center WebRTC
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
