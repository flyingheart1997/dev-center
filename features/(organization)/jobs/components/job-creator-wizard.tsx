"use client"

import { useJobCreator } from "@/features/(organization)/jobs/hooks/use-job-creator"
import { JobBasicInfoStep } from "./job-basic-info-step"
import { JobSkillsStep } from "./job-skills-step"
import { JobRoundsStep } from "./job-rounds-step"
import { JobReviewStep } from "./job-review-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

export function JobCreatorWizard() {
  const {
    wizardStep,
    wizardDraft,
    orgStructure,
    employees,
    isSubmitting,
    updateWizardDraft,
    handleNext,
    handlePrev,
    addRound,
    removeRound,
    updateRound,
    handleSubmit,
  } = useJobCreator()

  const steps = [
    { number: 1, title: "Basic Information", desc: "Title, Salary & Location" },
    { number: 2, title: "Skills & Description", desc: "Skills tagger & responsibilities" },
    { number: 3, title: "Pipeline Setup", desc: "Custom interview rounds" },
    { number: 4, title: "Review & Publish", desc: "Verify requisition & status" },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 px-2">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Job Requisition</h1>
        <p className="text-sm text-muted-foreground">
          Define multi-round interview pipelines and automated candidate pre-screening rules.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((s) => {
          const isCompleted = s.number < wizardStep
          const isCurrent = s.number === wizardStep

          return (
            <div
              key={s.number}
              className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${isCurrent
                  ? "border-primary bg-primary/5 text-foreground shadow-xs"
                  : isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                    : "border-border bg-card text-muted-foreground opacity-60"
                }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.number}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{s.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Content Card */}
      <Card className="border border-border">
        <CardContent className="p-6">
          {wizardStep === 1 && (
            <JobBasicInfoStep
              draft={wizardDraft}
              orgStructure={orgStructure}
              updateDraft={updateWizardDraft}
            />
          )}

          {wizardStep === 2 && (
            <JobSkillsStep draft={wizardDraft} updateDraft={updateWizardDraft} />
          )}

          {wizardStep === 3 && (
            <JobRoundsStep
              draft={wizardDraft}
              employees={employees}
              updateDraft={updateWizardDraft}
              addRound={addRound}
              removeRound={removeRound}
              updateRound={updateRound}
            />
          )}

          {wizardStep === 4 && (
            <JobReviewStep
              draft={wizardDraft}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}

          {/* Navigation Bar */}
          {wizardStep < 4 && (
            <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={wizardStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button type="button" onClick={handleNext}>
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
