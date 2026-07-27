import { Badge } from "@/components/ui/badge"
import { JobStatus } from "@/types/enums"
import { cn } from "@/lib/utils"

interface JobStatusBadgeProps {
  status: JobStatus | string
  className?: string
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  switch (status) {
    case JobStatus.ACTIVE:
    case "Active":
      return (
        <Badge
          variant="outline"
          className={cn("bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15", className)}
        >
          ● Active Published
        </Badge>
      )
    case JobStatus.DRAFT:
    case "Draft":
      return (
        <Badge
          variant="outline"
          className={cn("bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/15", className)}
        >
          Draft
        </Badge>
      )
    case JobStatus.PENDING_APPROVAL:
    case "Pending_Approval":
      return (
        <Badge
          variant="outline"
          className={cn("bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15", className)}
        >
          ⏳ Pending Approval
        </Badge>
      )
    case JobStatus.COMPLETED:
    case "Completed":
      return (
        <Badge
          variant="outline"
          className={cn("bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/15", className)}
        >
          Archived / Closed
        </Badge>
      )
    default:
      return <Badge variant="secondary" className={className}>{status}</Badge>
  }
}
