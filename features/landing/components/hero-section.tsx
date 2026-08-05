"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroInteractivePreview } from "./hero-interactive-preview"

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-border/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Top Minimal Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">New</Badge>
          <span>The Unified Enterprise Recruitment Operating System</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            The All-in-One Hiring Engine:{" "}
            <span className="text-primary">
              ATS, AI Screening & Live Interviews
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Consolidate your entire recruitment workflow. Source candidates, run automated Gemini AI voice & coding pre-screenings, and host live collaborative WebRTC interview rooms in one unified platform.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
          <Button size="lg" asChild className="h-11 px-6 text-sm font-semibold gap-2">
            <Link href="/register">
              Start Hiring For Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild className="h-11 px-6 text-sm font-medium gap-2">
            <Link href="#ai-screening">
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch Live Demo
            </Link>
          </Button>
        </div>

        {/* Key USPs */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free 10,000 Candidate Screenings
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No Credit Card Required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> SOC 2 & Multi-Tenant Isolated
          </span>
        </div>

        {/* Master Interactive Visualizer Preview */}
        <div className="pt-4">
          <HeroInteractivePreview />
        </div>

      </div>
    </section>
  )
}
