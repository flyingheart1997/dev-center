import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Video, ClipboardList, Building2, UserCheck } from "lucide-react"

interface KpiStats {
  activeJobs: number
  draftJobs: number
  totalCandidates: number
  scheduledInterviews: number
  pendingApprovals: number
  totalBranches: number
  totalEmployees: number
}

interface KpiSummaryCardsProps {
  stats: KpiStats
}

export function KpiSummaryCards({ stats }: KpiSummaryCardsProps) {
  const cards = [
    {
      title: "Active Job Requisitions",
      value: stats.activeJobs,
      subtitle: `${stats.draftJobs} drafts ready`,
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Pipeline Candidates",
      value: stats.totalCandidates,
      subtitle: "Total applicants processed",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "Scheduled Interviews",
      value: stats.scheduledInterviews,
      subtitle: "Upcoming live sessions",
      icon: Video,
      color: "text-purple-500",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      subtitle: stats.pendingApprovals > 0 ? "Requires review" : "All cleared",
      icon: ClipboardList,
      color: "text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
