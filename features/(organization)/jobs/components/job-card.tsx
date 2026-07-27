import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { JobStatusBadge } from "./job-status-badge"
import { MapPin, Users, MoreVertical, Copy, Power, Layers, ArrowRight } from "lucide-react"
import { JobStatus } from "@/types/enums"

interface JobCardProps {
  job: {
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
  }
  onClone: (jobId: string) => void
  onClose: (jobId: string) => void
}

export function JobCard({ job, onClone, onClose }: JobCardProps) {
  return (
    <Card className="border border-border hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between group">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <JobStatusBadge status={job.status} />
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/jobs/${job.id}/candidates`} className="cursor-pointer">
                  <Users className="w-4 h-4 mr-2 text-primary" /> View Candidates
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClone(job.id)} className="cursor-pointer">
                <Copy className="w-4 h-4 mr-2" /> Clone Requisition
              </DropdownMenuItem>
              {(job.status === JobStatus.ACTIVE || job.status === "Active") && (
                <DropdownMenuItem
                  onClick={() => onClose(job.id)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Power className="w-4 h-4 mr-2" /> Close Requisition
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location & Dept */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
          {job.department && (
            <Badge variant="secondary" className="text-[11px] font-normal">
              {job.department.name}
            </Badge>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {job.location || "Remote"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2 space-y-3 text-xs">
        {/* Salary & Remote type */}
        <div className="flex items-center justify-between text-muted-foreground border-y border-border/50 py-2">
          <span>
            {job.salaryMin && job.salaryMax
              ? `${job.currency} ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k`
              : "Competitive"}
          </span>
          <span className="capitalize">{job.remoteType}</span>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map((s, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium"
            >
              {s.skill.name}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground font-semibold">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Users className="w-3.5 h-3.5 text-primary" /> {job._count.applications} Applicants
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {job._count.rounds} Rounds
          </span>
        </div>

        <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary">
          <Link href={`/jobs/${job.id}/candidates`}>
            Pipeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
