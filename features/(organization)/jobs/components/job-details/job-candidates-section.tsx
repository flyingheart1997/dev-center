"use client"

import * as React from "react"
import { Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useJobDetails } from "../../hooks/use-job-details"
import {
  CandidateEvaluationCard,
  CandidateEvaluationData,
} from "@/features/(organization)/candidates/components/candidate-evaluation-card"

export function JobCandidatesSection() {
  const {
    job,
    filteredApplications,
    candidateSearch,
    setCandidateSearch,
    candidateStatusFilter,
    setCandidateStatusFilter,
  } = useJobDetails()

  if (!job) return null

  const statusFilterOptions = [
    { label: "All Applicants", value: "ALL", count: job.applications?.length || 0 },
    { label: "Applied", value: "Applied", count: job.applications?.filter((a: any) => a.status === "Applied").length || 0 },
    { label: "Screening", value: "Screening", count: job.applications?.filter((a: any) => a.status === "Screening").length || 0 },
    { label: "Shortlisted", value: "Shortlisted", count: job.applications?.filter((a: any) => a.status === "Shortlisted").length || 0 },
    { label: "Interviewing", value: "Interviewing", count: job.applications?.filter((a: any) => a.status === "Interviewing").length || 0 },
    { label: "Offer", value: "Offer", count: job.applications?.filter((a: any) => a.status === "Offer").length || 0 },
    { label: "Hired", value: "Hired", count: job.applications?.filter((a: any) => a.status === "Hired" || a.status === "OfferAccepted").length || 0 },
    { label: "Rejected", value: "Rejected", count: job.applications?.filter((a: any) => a.status === "Rejected").length || 0 },
  ]

  return (
    <div className="space-y-4">
      {/* Search & Status Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search candidate or email..."
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {statusFilterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={candidateStatusFilter === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCandidateStatusFilter(opt.value)}
              className="h-7 text-xs font-medium px-2.5 shrink-0"
            >
              {opt.label} ({opt.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Filtered Candidates List */}
      {filteredApplications.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-border/80 space-y-3">
          <div className="h-10 w-10 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-foreground">No Candidates Found</h4>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              No applicant submissions match your selected status or search query.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app: any) => {
            const user = app.candidate?.user
            const userName = user?.name || "Candidate"
            const userEmail = user?.email || ""
            const userImage = user?.image || ""
            const aiScore = app.screeningResult?.overallScore || app.screeningScore || 80

            const candidateData: CandidateEvaluationData = {
              id: app.id,
              candidateName: userName,
              candidateEmail: userEmail,
              candidateImage: userImage,
              jobTitle: job.title,
              departmentName: job.department?.name,
              status: app.status,
              screeningScore: aiScore,
              createdAt: app.createdAt,
            }

            return (
              <CandidateEvaluationCard
                key={app.id}
                candidate={candidateData}
                showHoverOverlay={true}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
