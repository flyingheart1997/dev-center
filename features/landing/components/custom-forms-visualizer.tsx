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

export function CustomFormsVisualizer() {
  const templates = [
    { title: "Visa & Work Authorization", icon: Globe, count: "3 Questions", attached: true },
    { title: "Ex-Employee Verification", icon: Building, count: "2 Questions", attached: true },
    { title: "Background Check Authorization", icon: ShieldAlert, count: "4 Questions", attached: true },
    { title: "Criminal & Conflict Declarations", icon: HelpCircle, count: "3 Questions", attached: false }
  ]

  return (
    <section className="py-16 md:py-20 border-b border-border/40 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
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

        {/* Form Builder Visualizer: Top Aligned items-start */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Grouped Template Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <Card className="p-4 border-border/70 bg-card shadow-none space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-foreground">Requisition Question Templates</h3>
                  <p className="text-[11px] text-muted-foreground">Select templates to attach to application form</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Library</Badge>
              </div>

              <div className="space-y-2">
                {templates.map((tmpl, idx) => {
                  const Icon = tmpl.icon
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                        tmpl.attached ? 'border-primary/40 bg-muted/30' : 'border-border/60 bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-md bg-muted border border-border/60 text-foreground shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs text-foreground truncate">{tmpl.title}</div>
                          <div className="text-[11px] text-muted-foreground">{tmpl.count}</div>
                        </div>
                      </div>
                      
                      {tmpl.attached ? (
                        <Badge variant="secondary" className="text-[10px] shrink-0 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-500" /> Attached
                        </Badge>
                      ) : (
                        <Button size="xs" variant="outline" className="h-7 text-[10px] shrink-0 gap-1">
                          <Plus className="h-3 w-3" /> Attach
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Column: Clean Applicant Form Preview (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-5 sm:p-6 border-border/70 bg-card shadow-xl space-y-4">
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
          </div>

        </div>

      </div>
    </section>
  )
}
