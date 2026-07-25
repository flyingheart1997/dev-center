import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight, Video, FileText, ClipboardList } from "lucide-react"

export interface ActionTaskItem {
  id: string
  title: string
  subtitle: string
  time: string
  actionUrl: string
  actionText: string
  type: "interview" | "scorecard" | "approval" | "job"
}

interface TodayActionTasksWidgetProps {
  tasks: ActionTaskItem[]
}

export function TodayActionTasksWidget({ tasks }: TodayActionTasksWidgetProps) {
  if (tasks.length === 0) {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Today's Action Tasks
          </CardTitle>
          <CardDescription>Your operational checklist for today</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground">All tasks completed for today!</p>
          <p className="text-xs text-muted-foreground mt-1">No pending action items or interview rooms assigned.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Today's Action Tasks
          </CardTitle>
          <CardDescription>High priority tasks assigned to your role</CardDescription>
        </div>
        <Badge variant="secondary" className="text-xs">
          {tasks.length} Pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => {
          return (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors gap-3"
            >
              <div className="flex items-start gap-3">
                {task.type === "interview" && <Video className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />}
                {task.type === "scorecard" && <FileText className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />}
                {task.type === "approval" && <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />}
                {task.type === "job" && <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{task.title}</span>
                  <span className="text-xs text-muted-foreground">{task.subtitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{task.time}</span>
                <Button size="sm" asChild className="h-8 text-xs">
                  <Link href={task.actionUrl}>
                    {task.actionText}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
