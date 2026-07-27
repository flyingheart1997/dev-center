import { JobCard } from "./job-card"
import { JobStatus } from "@/types/enums"
import { Briefcase } from "lucide-react"

interface JobsGridViewProps {
  jobs: Array<{
    id: string
    title: string
    status: JobStatus | string
    location: string | null
    remoteType: string
    salaryMin: number | null
    salaryMax: number | null
    currency: string
    createdAt: Date | string
    department?: { name: string } | null
    branch?: { name: string } | null
    businessUnit?: { name: string } | null
    skills: Array<{ skill: { name: string } }>
    _count: {
      applications: number
      rounds: number
    }
  }>
  onClone: (jobId: string) => void
  onClose: (jobId: string) => void
}

export function JobsGridView({ jobs, onClone, onClose }: JobsGridViewProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed border-border bg-card">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-base">No Job Requisitions Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          There are no job requisitions matching your current filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClone={onClone} onClose={onClose} />
      ))}
    </div>
  )
}
