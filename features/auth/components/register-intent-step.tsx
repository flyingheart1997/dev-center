"use client"

import React from "react"
import { Building2, User, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type RegisterIntent = "candidate" | "organization"

interface RegisterIntentStepProps {
  intent: RegisterIntent | null
  onSelect: (intent: RegisterIntent) => void
  onContinue: () => void
}

export function RegisterIntentStep({ intent, onSelect, onContinue }: RegisterIntentStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div
          className={cn(
            "relative flex cursor-pointer items-center justify-start gap-4 rounded-xl border-2 p-6 transition-all hover:bg-accent/50",
            intent === "candidate"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-muted bg-transparent hover:border-border"
          )}
          onClick={() => onSelect("candidate")}
        >
          <div
            className={cn(
              "rounded-full p-3 transition-colors shrink-0",
              intent === "candidate" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            <User className="h-6 w-6" />
          </div>
          <div className="text-start">
            <h3 className="font-semibold leading-none tracking-tight">I am a Candidate</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Explore jobs, practice interviews, and track your applications.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "relative flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 rounded-xl border-2 p-6 transition-all cursor-pointer hover:bg-accent/50",
            intent === "organization"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-muted bg-transparent hover:border-border"
          )}
          onClick={() => onSelect("organization")}
        >
          <div
            className={cn(
              "rounded-full p-3 transition-colors shrink-0",
              intent === "organization" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div className="text-start flex-1 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Create an Organization</h3>
            <p className="text-xs text-muted-foreground">
              Post jobs, screen candidates with AI, and manage your hiring pipeline.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 absolute right-2 top-2">
              <Lock className="h-3 w-3" />Work Email Required
            </span>
          </div>
        </div>
      </div>

      <Button type="button" onClick={onContinue} disabled={!intent} className="w-full h-11">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
