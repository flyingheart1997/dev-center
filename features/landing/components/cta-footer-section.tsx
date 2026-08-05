"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import {
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandYoutube
} from "@tabler/icons-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeInWhenVisible, ParallaxGlow, GlowingOrbParticles } from "./landing-motion"

export function CTAFooterSection() {
  return (
    <footer className="relative bg-card border-t border-border/40 overflow-hidden">
      <ParallaxGlow offset={60} className="w-125 h-125 bg-primary/15 top-[10%] left-1/2 -translate-x-1/2" />
      <GlowingOrbParticles count={12} />

      {/* Top CTA Conversion Banner */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <FadeInWhenVisible distance={30} delay={0}>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-8 sm:p-12 text-center space-y-5 shadow-xl">

            <Badge variant="outline" className="px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Get Started Free
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
              Ready to Replace Multiple Hiring Tools with One Unified Platform?
            </h2>

            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              Join recruiters and hiring managers streamlining ATS candidate tracking, AI voice pre-screening, and live WebRTC interviews today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild className="h-11 px-7 text-sm font-semibold gap-2 shadow-md">
                  <Link href="/register">
                    Start Hiring For Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild className="h-11 px-7 text-sm font-medium">
                  <Link href="/login">
                    Sign In to Dashboard
                  </Link>
                </Button>
              </motion.div>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Free forever tier includes 10,000 candidate screenings. No credit card required.
            </p>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-border/40 py-10 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

            <div className="col-span-2 space-y-3 text-left">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-base tracking-tight text-foreground">Dev-Center</span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Multi-tenant SaaS recruitment platform consolidating ATS, AI pre-screening, and live collaborative WebRTC video interview rooms.
              </p>
              <div className="flex items-center gap-3 text-muted-foreground pt-1">
                <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">
                  <IconBrandGithub className="h-4 w-4" />
                </Link>
                <Link href="https://twitter.com" target="_blank" className="hover:text-foreground transition-colors">
                  <IconBrandX className="h-4 w-4" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors">
                  <IconBrandLinkedin className="h-4 w-4" />
                </Link>
                <Link href="https://youtube.com" target="_blank" className="hover:text-foreground transition-colors">
                  <IconBrandYoutube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-2.5 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground font-medium">
                <li><Link href="#ats-pipeline" className="hover:text-foreground">ATS Pipeline</Link></li>
                <li><Link href="#ai-screening" className="hover:text-foreground">AI Screening</Link></li>
                <li><Link href="#ai-screening" className="hover:text-foreground">Virtual Compiler</Link></li>
                <li><Link href="#live-interviews" className="hover:text-foreground">Live WebRTC</Link></li>
                <li><Link href="#candidate-hub" className="hover:text-foreground">Candidate Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Solutions</h4>
              <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                <li><Link href="#solutions" className="hover:text-foreground">Enterprise HR</Link></li>
                <li><Link href="#solutions" className="hover:text-foreground">Tech Managers</Link></li>
                <li><Link href="#solutions" className="hover:text-foreground">Recruiters</Link></li>
                <li><Link href="#solutions" className="hover:text-foreground">Candidates</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing Plans</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Dev-Center Inc. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>SOC 2 Type II Certified · Multi-Tenant Isolation Enforced</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  )
}

