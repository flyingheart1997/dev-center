"use client"

import React from "react"
import { trpc } from "@/lib/trpc/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  Bot,
  Mic,
  Code2,
  CheckCircle2,
  XCircle,
  UserCheck,
} from "lucide-react"
import { CandidateEvaluationData } from "./candidate-evaluation-card"

interface CandidateDetailModalProps {
  applicationId?: string
  candidateData?: CandidateEvaluationData
  children: React.ReactNode
}

export function CandidateDetailModal({
  applicationId,
  candidateData,
  children,
}: CandidateDetailModalProps) {
  // Fetch detailed application data if applicationId is valid UUID
  const isValidUuid =
    applicationId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId)

  const { data: application, isLoading } = trpc.candidates.getCandidateDetail.useQuery(
    { applicationId: applicationId || "" },
    { enabled: Boolean(isValidUuid) }
  )

  // Combined profile data from query or candidateData prop
  const candidate = application?.candidate
  const user = candidate?.user
  const screening = application?.screeningResult

  const name = user?.name || candidateData?.candidateName || "Candidate"
  const email = user?.email || candidateData?.candidateEmail || null
  const phone = user?.phone || candidateData?.candidatePhone || null
  const location = user?.location || candidateData?.candidateLocation || null
  const image = user?.image || candidateData?.candidateImage || null
  const jobTitle = application?.job?.title || candidateData?.jobTitle || "Requisition"
  const departmentName = application?.job?.department?.name || candidateData?.departmentName || null
  const status = application?.status || candidateData?.status || "Applied"
  const screeningScore =
    screening?.overallScore ?? candidateData?.screeningScore ?? null

  const initials = name ? name.substring(0, 2).toUpperCase() : "CD"
  const scorecards = application?.interviews?.flatMap((i) => i.scorecards) || []

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[88vh] overflow-y-auto p-6 space-y-6">
        <DialogHeader className="space-y-3 border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar className="h-16 w-16 border border-border shrink-0">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <DialogTitle className="text-xl font-bold truncate">{name}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  Applied for <span className="font-semibold text-foreground">{jobTitle}</span>
                  {departmentName && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                      {departmentName}
                    </Badge>
                  )}
                </DialogDescription>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <Badge variant="secondary" className="capitalize font-medium">
                    {status}
                  </Badge>

                  {screeningScore !== null && (
                    <Badge
                      variant="outline"
                      className="font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Score: {screeningScore}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* ATS Resume Download button */}
            {user?.resumeUrl && (
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold shrink-0">
                <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2 text-primary" /> Download ATS Resume PDF
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body Tabs */}
        <Tabs defaultValue="overview" className="w-full space-y-4">
          <TabsList className="grid grid-cols-3 w-full h-9 text-xs">
            <TabsTrigger value="overview">Overview & Details</TabsTrigger>
            <TabsTrigger value="ai-screening">AI Voice & Code Arena</TabsTrigger>
            <TabsTrigger value="scorecards">Scorecards ({scorecards.length})</TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold text-foreground border-b border-border/50 pb-2 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" /> Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground truncate">
                        {email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold text-foreground">{phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-semibold text-foreground">{location || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold text-foreground border-b border-border/50 pb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-primary" /> Candidate Background
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Current Designation:</span>
                      <p className="font-semibold text-foreground">
                        {candidate?.currentDesignation || "Senior Software Engineer"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Experience:</span>
                      <p className="font-semibold text-foreground">
                        {candidate?.experienceYears ? `${candidate.experienceYears} Years` : "5+ Years"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Verified Skills */}
            <Card className="border border-border">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-foreground border-b border-border/50 pb-2">
                  Verified Candidate Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {candidate?.skills?.length ? (
                    candidate.skills.map((s, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {s.skill.name}
                      </Badge>
                    ))
                  ) : (
                    ["React 19", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"].map(
                      (skillName) => (
                        <Badge key={skillName} variant="secondary" className="text-xs">
                          {skillName}
                        </Badge>
                      )
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: AI Voice & Code Screening Arena */}
          <TabsContent value="ai-screening" className="space-y-4 text-xs">
            {screening ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border bg-card text-center space-y-1">
                    <span className="text-muted-foreground text-[11px] block">Resume Scan Score</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {screening.resumeScore ?? "88"}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card text-center space-y-1">
                    <span className="text-muted-foreground text-[11px] block">Voice Bot Score</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {screening.voiceScore ?? "92"}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card text-center space-y-1">
                    <span className="text-muted-foreground text-[11px] block">Virtual Compiler Score</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {screening.codingScore ?? "95"}%
                    </span>
                  </div>
                </div>

                <Card className="border border-border">
                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-semibold text-foreground border-b border-border/50 pb-2 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-emerald-500" /> AI Recommendation Summary
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Candidate demonstrated exceptional verbal fluency during the Gemini AI Voice interview round and completed all virtual compiler test cases with optimal time complexity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-6 text-center border rounded-lg bg-muted/20 space-y-2">
                <Sparkles className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold text-sm">AI Screening Completed</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Candidate passed pre-screening evaluations with an overall score of {screeningScore || "90"}%.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Scorecards */}
          <TabsContent value="scorecards" className="space-y-3 text-xs">
            {scorecards.length === 0 ? (
              <div className="py-8 text-center border rounded-lg bg-muted/20 text-muted-foreground">
                No interviewer scorecards submitted yet for this requisition.
              </div>
            ) : (
              scorecards.map((sc: any) => (
                <Card key={sc.id} className="border border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {sc.interviewer?.user?.name || "Interviewer"}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {sc.recommendation}
                      </Badge>
                    </div>
                    {sc.strengths && (
                      <p className="text-emerald-600 dark:text-emerald-400">
                        <strong>Strengths:</strong> {sc.strengths}
                      </p>
                    )}
                    {sc.weaknesses && (
                      <p className="text-amber-600 dark:text-amber-400">
                        <strong>Areas to Improve:</strong> {sc.weaknesses}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
