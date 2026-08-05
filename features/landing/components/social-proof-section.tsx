"use client"

import * as React from "react"
import { ShieldCheck, Zap, Users, Trophy } from "lucide-react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { FadeInWhenVisible, StaggerGroup, StaggerItem, TiltCard, AnimatedCounter, SpotlightCard } from "./landing-motion"

export function SocialProofSection() {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Candidates AI Screened",
      subtext: "Automated voice & coding tests"
    },
    {
      icon: Zap,
      value: "75%",
      label: "Reduction in Time-to-Hire",
      subtext: "From application to offer letter"
    },
    {
      icon: Trophy,
      value: "99.4%",
      label: "AI Match Score Accuracy",
      subtext: "Powered by Gemini AI Engine"
    },
    {
      icon: ShieldCheck,
      value: "< 50ms",
      label: "Live WebRTC Sync Latency",
      subtext: "LiveKit video + shared Monaco editor"
    }
  ]

  return (
    <section className="py-12 border-b border-border/40 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <FadeInWhenVisible delay={0}>
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Proven Scale & Enterprise Performance
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Trusted by fast-growing engineering teams & global recruiters
            </h3>
          </div>
        </FadeInWhenVisible>

        {/* Minimal Stats Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <StaggerItem key={idx}>
                <SpotlightCard className="h-full">
                  <TiltCard tiltAmount={8} className="h-full">
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                      <Card className="h-full p-5 border-border/60 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            <AnimatedCounter value={stat.value} />
                          </div>
                          <div className="text-xs font-semibold text-foreground mt-1">{stat.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{stat.subtext}</div>
                        </div>
                      </Card>
                    </motion.div>
                  </TiltCard>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

      </div>
    </section>
  )
}

