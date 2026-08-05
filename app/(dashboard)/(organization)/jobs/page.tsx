import { Suspense } from "react"
import { JobsDashboard } from "@/features/(organization)/jobs/components/jobs-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Job Requisitions | Dev-Center",
  description: "Enterprise multi-tenant job requisition management and interview pipeline configuration.",
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <JobsDashboard />
    </Suspense>
  )
}
