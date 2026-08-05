import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Briefcase, Sparkles, CheckCircle2, Clock } from "lucide-react"
import { JobStatus } from "@/types/enums"
import { CreateJobInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"

interface JobReviewStepProps {
  draft: CreateJobInput
  isSubmitting: boolean
  onSubmit: (status: JobStatus) => void
}

export function JobReviewStep({ draft, isSubmitting, onSubmit }: JobReviewStepProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-foreground">Requisition Ready for Review</p>
          <p className="text-muted-foreground">
            Please review the details below. Once published, candidates can complete the mandatory 3-step AI pre-screening assessment (resume scan + voice interview + basic coding test) to apply.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border border-border">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{draft.title || "Untitled Requisition"}</CardTitle>
            <Badge variant="outline" className="capitalize">
              {draft.employmentType.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{draft.location}</p>
                <p className="text-muted-foreground">{draft.remoteType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">
                  {draft.currency} {draft.salaryMin?.toLocaleString()} - {draft.salaryMax?.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Annual Salary</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{draft.experienceLevel} Level</p>
                <p className="text-muted-foreground">Experience Required</p>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {draft.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interview Rounds Pipeline */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Interview Evaluation Rounds ({draft.rounds.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {draft.rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-md border border-border bg-muted/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-foreground">{round.title}</span>
                  </div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {round.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Job Description Preview
            </h4>
            <div className="p-3 rounded-md bg-muted/30 text-xs text-muted-foreground whitespace-pre-wrap max-h-36 overflow-y-auto">
              {draft.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onSubmit(JobStatus.DRAFT)}
          className="w-full sm:w-auto"
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={() => onSubmit(JobStatus.PENDING_APPROVAL)}
          className="w-full sm:w-auto"
        >
          Submit for Approval
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSubmit(JobStatus.ACTIVE)}
          className="w-full sm:w-auto font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" /> Publish Requisition
        </Button>
      </div>
    </div>
  )
}
