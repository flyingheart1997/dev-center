"use client"

import * as React from "react"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(true)

  const plans = [
    {
      name: "Starter Free",
      price: "$0",
      period: "forever",
      description: "Perfect for early-stage startups and small hiring teams.",
      features: [
        "Up to 3 Active Job Requisitions",
        "50 Gemini AI Candidate Screenings / mo",
        "Basic ATS & Kanban Candidate Pipeline",
        "Standard Job Application Forms",
        "Community Support"
      ],
      cta: "Get Started Free",
      href: "/register",
      highlight: false
    },
    {
      name: "Growth Pro",
      price: isAnnual ? "$149" : "$199",
      period: "/ month",
      description: "For scaling hiring teams needing AI voice screening & live WebRTC rooms.",
      features: [
        "Unlimited Active Job Requisitions",
        "500 Gemini AI Voice & Coding Screenings / mo",
        "Live WebRTC Video & Shared Pair-Coding Rooms",
        "Custom Compliance Application Form Builder",
        "Candidate Merit Ranking & Scorecard Analytics",
        "Priority Email & Chat Support"
      ],
      cta: "Start 14-Day Free Trial",
      href: "/register",
      highlight: true
    },
    {
      name: "Enterprise B2B",
      price: "Custom",
      period: "tailored SLA",
      description: "For large enterprise organizations requiring multi-unit RBAC & compliance.",
      features: [
        "Everything in Growth Pro + Unlimited Screenings",
        "Multi-Tenant Hierarchy (Business Units, Branches)",
        "Granular Role-Based Access Control (RBAC)",
        "Security Audit Logs & Custom Domain Integration",
        "Dedicated Success Manager & Custom SLA"
      ],
      cta: "Contact Enterprise Sales",
      href: "/contact",
      highlight: false
    }
  ]

  return (
    <section id="pricing" className="py-16 md:py-20 border-b border-border/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Transparent Pricing
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Simple Plans That Scale With Your Hiring Needs
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            No hidden fees or per-seat penalties. Pay for the AI candidate screening volume you need.
          </p>

          {/* Perfectly Aligned Radix Switch Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>

            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual billing"
            />

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
                Save 25%
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid with pt-6 so -top-3 badge is never clipped */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`p-6 sm:p-7 rounded-xl flex flex-col justify-between space-y-6 transition-all relative ${plan.highlight
                ? 'border-primary bg-card shadow-lg ring-1 ring-primary/40'
                : 'border-border/70 bg-card shadow-none'
                }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-3 shadow-md z-10">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground font-medium">{plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-border/40">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={plan.highlight ? "default" : "outline"}
                size="default"
                asChild
                className="w-full h-10 text-xs font-semibold gap-1.5"
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
