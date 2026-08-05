"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Play } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroInteractivePreview } from "./hero-interactive-preview"
import { FadeInWhenVisible, ParallaxGlow, StaggerGroup, StaggerItem, FloatElement, PerspectiveScrollFrame, TextShimmer, GlowingOrbParticles } from "./landing-motion"

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-border/40 overflow-hidden">
      {/* Background Parallax Ambient Glow & Star Orbs */}
      <ParallaxGlow offset={80} className="w-125 h-125 bg-primary/20 -top-25 left-1/2 -translate-x-1/2" />
      <ParallaxGlow offset={-50} className="w-87.5 h-87.5 bg-purple-500/15 top-50 left-1/4" />
      <GlowingOrbParticles count={16} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-center relative z-10">

        {/* Top Minimal Pill Badge */}
        <FadeInWhenVisible direction="down" distance={20} delay={0}>
          <FloatElement distance={4} duration={3} className="inline-block">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-xs">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">New</Badge>
              <span>The Unified Enterprise Recruitment Operating System</span>
            </div>
          </FloatElement>
        </FadeInWhenVisible>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <FadeInWhenVisible delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              The All-in-One Hiring Engine:{" "}
              <TextShimmer>
                ATS, AI Screening & Live Interviews
              </TextShimmer>
            </h1>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Consolidate your entire recruitment workflow. Source candidates, run automated Gemini AI voice & coding pre-screenings, and host live collaborative WebRTC interview rooms in one unified platform.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Action CTAs */}
        <FadeInWhenVisible delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" asChild className="h-11 px-6 text-sm font-semibold gap-2 shadow-md hover:shadow-primary/20 transition-all">
                <Link href="/register">
                  Start Hiring For Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" asChild className="h-11 px-6 text-sm font-medium gap-2">
                <Link href="#ai-screening">
                  <Play className="h-3.5 w-3.5 fill-current text-primary" />
                  Watch Live Demo
                </Link>
              </Button>
            </motion.div>
          </div>
        </FadeInWhenVisible>

        {/* Key USPs */}
        <StaggerGroup staggerDelay={0.08} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium pt-1">
          <StaggerItem>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free 10,000 Candidate Screenings
            </span>
          </StaggerItem>
          <StaggerItem>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No Credit Card Required
            </span>
          </StaggerItem>
          <StaggerItem>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> SOC 2 & Multi-Tenant Isolated
            </span>
          </StaggerItem>
        </StaggerGroup>

        {/* Master Interactive Visualizer Preview */}
        <PerspectiveScrollFrame className="pt-4">
          <HeroInteractivePreview />
        </PerspectiveScrollFrame>

      </div>
    </section>
  )
}

