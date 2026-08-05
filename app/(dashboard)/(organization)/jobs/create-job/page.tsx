import { JobCreatorWizard } from "@/features/(organization)/jobs/components/create-new-job/job-creator-wizard"

export const metadata = {
  title: "New Job Requisition | Dev-Center",
  description: "Create a new job requisition with custom interview rounds and AI pre-screening parameters.",
}

export default function NewJobPage() {
  return <JobCreatorWizard />
}
