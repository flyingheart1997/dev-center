"use client"

import React from "react"
import { User, Building2 } from "lucide-react"

interface RegisterIntentStepProps {
  onSelect: (type: "candidate" | "employee") => void
}

export function RegisterIntentStep({ onSelect }: RegisterIntentStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect("candidate")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect("candidate")
        }}
        className="flex flex-col items-center justify-center p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-accent/50 cursor-pointer transition-all text-center space-y-3 group focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-base">Candidate / Job Seeker</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Practice AI voice interviews, analyze ATS resumes & solve coding problems.
          </p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect("employee")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect("employee")
        }}
        className="flex flex-col items-center justify-center p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-accent/50 cursor-pointer transition-all text-center space-y-3 group focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors">
          <Building2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-base">Register an Organization</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Build multi-tenant workspace, manage branches & automate ATS screening.
          </p>
        </div>
      </div>
    </div>
  )
}
