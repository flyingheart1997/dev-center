import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Video, UserCheck, Plus, ArrowUpRight } from "lucide-react"

export function OrganizationDashboard() {
  const stats = [
    { title: "Active Job Listings", value: "12", change: "+3 this week", icon: Briefcase, color: "text-blue-500" },
    { title: "Screened Candidates", value: "148", change: "+24 today", icon: Users, color: "text-emerald-500" },
    { title: "Scheduled Interviews", value: "8", change: "Next at 2:00 PM", icon: Video, color: "text-purple-500" },
    { title: "Pending Approvals", value: "4", change: "Requires action", icon: UserCheck, color: "text-amber-500" },
  ]

  const recentCandidates = [
    { name: "Alex Rivera", role: "Senior Frontend Engineer", status: "AI Passed (94%)", time: "10 mins ago" },
    { name: "Sarah Chen", role: "Full Stack Developer", status: "Interview Booked", time: "1 hour ago" },
    { name: "Marcus Vance", role: "Backend Architect (Go)", status: "Pending Review", time: "3 hours ago" },
  ]

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Enterprise Hiring Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor real-time AI screening evaluations, active ATS pipelines, and scheduled interviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10">
            <Link href="/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Job Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity & Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates Queue Card */}
        <Card className="lg:col-span-2 border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Candidate Evaluations</CardTitle>
              <CardDescription>Latest candidates processed by AI Voice & Coding virtual compiler</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/candidates">
                View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCandidates.map((cand, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground">{cand.name}</span>
                  <span className="text-xs text-muted-foreground">{cand.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {cand.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{cand.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Workspace Quick Actions</CardTitle>
            <CardDescription>Management shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/jobs">
                <Briefcase className="h-4 w-4 mr-2 text-primary" />
                Manage Job Postings
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/interviews">
                <Video className="h-4 w-4 mr-2 text-purple-500" />
                Launch Live Interview Room
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <Link href="/team">
                <UserCheck className="h-4 w-4 mr-2 text-amber-500" />
                Review Pending Members
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
