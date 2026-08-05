import { JobDetailsView } from "@/features/(organization)/jobs/components/job-details/job-details-view"

export const metadata = {
  title: "Job Requisition Details | Dev Center",
  description: "Enterprise Job Requisition Spec, ATS Candidate Funnel & Assessment Pipeline",
}

interface PageProps {
  params: Promise<{
    jobId: string
  }>
}

export default async function JobDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const { jobId } = resolvedParams

  return <JobDetailsView jobId={jobId} />
}
