"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export type FormFeedbackType = "success" | "error" | "info" | "warning"

export interface FormFeedbackProps {
  type?: FormFeedbackType
  message?: string | null
  successMessage?: string | null
  errorMessage?: string | null
  className?: string
}

export function FormFeedback({
  type,
  message,
  successMessage,
  errorMessage,
  className,
}: FormFeedbackProps) {
  const activeMessage = message || (type === "success" ? successMessage : errorMessage) || successMessage || errorMessage
  const activeType: FormFeedbackType = type || (errorMessage ? "error" : successMessage ? "success" : "info")

  if (!activeMessage) return null

  const variantStyles: Record<FormFeedbackType, string> = {
    success:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    warning:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  }

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const Icon = icons[activeType]

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 p-3 text-xs font-medium rounded-md border transition-all animate-in fade-in-0 slide-in-from-top-1",
        variantStyles[activeType],
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{activeMessage}</span>
    </div>
  )
}
