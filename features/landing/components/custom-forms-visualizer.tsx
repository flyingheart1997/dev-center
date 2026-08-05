"use client"

import * as React from "react"
import { 
  FileText, 
  Globe, 
  Building, 
  ShieldAlert, 
  HelpCircle,
  Check,
  Plus
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FadeInWhenVisible, ParallaxGlow, StaggerGroup, StaggerItem, SpotlightCard } from "./landing-motion"

export function CustomFormsVisualizer() {
  const templates = [
    { title: "Visa & Work Authorization", icon: Globe, count: "3 Questions", attached: true },
    { title: "Ex-Employee Verification", icon: Building, count: "2 Questions", attached: true },
    { title: "Background Check Authorization", icon: ShieldAlert, count: "4 Questions", attached: true },
    { title: "Criminal & Conflict Declarations", icon: HelpCircle, count: "3 Questions", attached: false }
  ]

  return (
    <section className="relative py-16 md:py-20 border-b border-border/40 bg-muted/10 overflow-hidden">
      <ParallaxGlow offset={50} className="w-87.5 h-87.5 bg-purple-500/10 top-[20%] -left-15" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <FadeInWhenVisible delay={0}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Custom Application Form Builder
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Gather Compliance & Custom Screening Details Upfront
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Attach predefined compliance question templates or build custom multi-step screening forms for every job requisition.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Form Builder Visualizer: Top Aligned items-start */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Grouped Template Selector (5 cols) */}
          <FadeInWhenVisible distance={30} delay={0.15} className="lg:col-span-5 space-y-3">
            <Card className="p-4 border-border/70 bg-card shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-foreground">Requisition Question Templates</h3>
                  <p className="text-[11px] text-muted-foreground">Select templates to attach to application form</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Library</Badge>
              </div>

              <StaggerGroup className="space-y-2">
                {templates.map((tpl, idx) => {
                  const Icon = tpl.icon
                  return (
                    <StaggerItem key={idx}>
                      <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-foreground">{tpl.title}</div>
                            <div className="text-[10px] text-muted-foreground">{tpl.count}</div>
                          </div>
                        </div>
                        {tpl.attached ? (
                          <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Attached</Badge>
                        ) : (
                          <Button size="xs" variant="outline" className="h-6 text-[10px] gap-1">
                            <Plus className="h-3 w-3" /> Attach
                          </Button>
                        )}
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerGroup>
            </Card>
          </FadeInWhenVisible>

          {/* Right Column: Live Form Preview (7 cols) */}
          <FadeInWhenVisible distance={30} delay={0.3} className="lg:col-span-7">
            <SpotlightCard>
              <Card className="p-5 border-border/70 bg-card shadow-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Candidate Application Form Preview</h4>
                    <p className="text-[11px] text-muted-foreground">Job: Staff Full Stack Engineer (TCS Mumbai)</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Preview Mode</Badge>
                </div>

                {/* Form Input Fields */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-foreground">1. Do you currently require visa sponsorship to work in this country?</Label>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                        <input type="radio" name="visa" defaultChecked className="accent-primary" /> No, authorized to work
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                        <input type="radio" name="visa" className="accent-primary" /> Yes, require sponsorship
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <Label className="text-xs font-medium text-foreground">2. Have you previously been employed by TCS or any parent entity?</Label>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                        <input type="radio" name="exemp" className="accent-primary" /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                        <input type="radio" name="exemp" defaultChecked className="accent-primary" /> No
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <div className="flex items-start gap-2">
                      <Checkbox id="bgcheck" defaultChecked className="mt-0.5" />
                      <label htmlFor="bgcheck" className="text-xs leading-snug text-muted-foreground">
                        I authorize Dev-Center and employer to perform background check verification upon offer acceptance.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button size="sm" className="text-xs gap-1.5 font-semibold">
                    <Check className="h-3.5 w-3.5" /> Submit & Start AI Screening
                  </Button>
                </div>

              </Card>
            </SpotlightCard>
          </FadeInWhenVisible>

        </div>

      </div>
    </section>
  )
}
