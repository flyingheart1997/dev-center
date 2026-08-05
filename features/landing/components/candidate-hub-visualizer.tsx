"use client"

import * as React from "react"
import {
  UserCheck,
  Sparkles,
  FileCheck2,
  Target
} from "lucide-react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FadeInWhenVisible, ParallaxGlow, StaggerGroup, StaggerItem, TiltCard } from "./landing-motion"

export function CandidateHubVisualizer() {
  return (
    <section id="candidate-hub" className="relative py-16 md:py-20 border-b border-border/40 overflow-hidden">
      <ParallaxGlow offset={60} className="w-100 h-100 bg-blue-500/10 top-[25%] -left-20" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        {/* Section Header */}
        <FadeInWhenVisible delay={0}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              <UserCheck className="h-3.5 w-3.5 mr-1 text-primary" />
              Dedicated Candidate Career Hub
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A Premium Candidate Experience with AI Matchmaking & Prep Arenas
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Empower job seekers with automated AI job matching, resume parsing studio, real-time application tracking, and an interactive voice practice arena.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Candidate Hub Clean Cards */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <StaggerItem>
            <TiltCard tiltAmount={6} className="h-full">
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                <Card className="h-full p-5 border-border/70 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-muted border border-border/60 text-primary">
                      <Target className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">98% Skill Match</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">AI Job Matchmaker</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Parses candidate skills and recommends relevant open requisitions instantly.
                    </p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg space-y-2 border border-border/40 text-xs">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>Lead React Developer</span>
                      <span className="font-mono text-xs text-primary">$150k</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">TCS Digital · Full-time</p>
                    <div className="flex gap-1 pt-1">
                      <Badge variant="outline" className="text-[9px]">React 19</Badge>
                      <Badge variant="outline" className="text-[9px]">Next.js</Badge>
                      <Badge variant="outline" className="text-[9px]">TypeScript</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TiltCard>
          </StaggerItem>

          {/* Card 2 */}
          <StaggerItem>
            <TiltCard tiltAmount={6} className="h-full">
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                <Card className="h-full p-5 border-border/70 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-muted border border-border/60 text-primary">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">ATS Optimized</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">ATS Resume Studio</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Extracts experience, formats profiles, and scores ATS readability automatically.
                    </p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg space-y-2 border border-border/40 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-medium text-muted-foreground">Resume Parsing Completeness</span>
                      <span className="font-bold text-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-1.5" />
                    <p className="text-[10px] text-emerald-500 font-medium">✓ 14 Verified Technical Skills Added</p>
                  </div>
                </Card>
              </motion.div>
            </TiltCard>
          </StaggerItem>

          {/* Card 3 */}
          <StaggerItem>
            <TiltCard tiltAmount={6} className="h-full">
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                <Card className="h-full p-5 border-border/70 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-muted border border-border/60 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Practice Mode</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground">AI Voice Prep Arena</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Allows candidates to practice mock AI voice interviews before real employer screening.
                    </p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg space-y-2 border border-border/40 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Mock Score</span>
                      <span className="font-bold text-primary font-mono">89 / 100</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Feedback: Enhance system design trade-offs explanation.</p>
                  </div>
                </Card>
              </motion.div>
            </TiltCard>
          </StaggerItem>

        </StaggerGroup>

      </div>
    </section>
  )
}

