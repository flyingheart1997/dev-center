import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { JobStatusBadge } from "./job-status-badge"
import { MoreVertical, Users, Copy, Power, ArrowRight } from "lucide-react"
import { JobStatus } from "@/types/enums"

interface JobsTableViewProps {
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
    skills: Array<{ skill: { name: string } }>
    _count: {
      applications: number
      rounds: number
    }
  }>
  onClone: (jobId: string) => void
  onClose: (jobId: string) => void
}

export function JobsTableView({ jobs, onClone, onClose }: JobsTableViewProps) {
  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg border-border bg-card text-muted-foreground text-sm">
        No job requisitions found matching current criteria.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-bold">Requisition Title</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold">Department</TableHead>
            <TableHead className="font-bold">Location</TableHead>
            <TableHead className="font-bold text-center">Applicants</TableHead>
            <TableHead className="font-bold text-center">Rounds</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-muted/20">
              <TableCell className="font-semibold">
                <Link
                  href={`/jobs/${job.id}/candidates`}
                  className="hover:text-primary transition-colors"
                >
                  {job.title}
                </Link>
                <div className="flex gap-1 pt-1">
                  {job.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {s.skill.name}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="text-xs">
                {job.department ? (
                  <Badge variant="outline">{job.department.name}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {job.location || "Remote"} ({job.remoteType})
              </TableCell>
              <TableCell className="text-center font-semibold text-sm">
                <Badge variant="secondary" className="px-2 py-0.5">
                  <Users className="w-3 h-3 mr-1 text-primary" /> {job._count.applications}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-xs font-mono">
                {job._count.rounds} rounds
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold">
                    <Link href={`/jobs/${job.id}/candidates`}>
                      Pipeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
