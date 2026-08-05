"use client"

import { useMemo } from "react"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"
import { getAppUrl } from "@/lib/utils/url-utils"
import { JobStatus, EmployeeRole } from "@/types/enums"

// Full Enterprise Mock Data for Demo & Fallback
const MOCK_JOB_DATA = {
  id: "job-demo-8bf7514",
  title: "Senior Staff Full-Stack Engineer (AI & Realtime UI)",
  description: `We are looking for a Senior Staff Full-Stack Engineer to lead the core architecture of our Enterprise AI Pre-Screening Engine and LiveKit WebRTC Collaborative Meeting Arena.

Key Responsibilities:
• Architect high-throughput Next.js 16 App Router & React 19 Server Components.
• Design real-time WebSocket state synchronizers for multi-interviewer Monaco code editors.
• Optimize Gemini API virtual compilers for instant code evaluation & test-case verifications.
• Mentor mid-level engineers and drive strict zero prop-drilling modular architecture.

Qualifications:
• 6+ years of professional full-stack development experience with TypeScript & React.
• Deep understanding of WebRTC streaming, LiveKit audio/video pipelines, and Prisma ORM.
• Demonstrated track record of building complex SaaS dashboards with zero UI flicker.`,
  status: JobStatus.COMPLETED,
  employmentType: "Full_Time",
  experienceLevel: "Senior",
  salaryMin: 180000,
  salaryMax: 240000,
  currency: "USD",
  location: "San Francisco, CA",
  remoteType: "Hybrid",
  publishedAt: "2026-07-15T10:00:00.000Z",
  closingDate: "2026-08-01T18:00:00.000Z",
  createdAt: "2026-07-10T09:00:00.000Z",
  department: { id: "dept-1", name: "Engineering & AI Research" },
  branch: { id: "branch-1", name: "San Francisco Headquarters" },
  businessUnit: { id: "bu-1", name: "Core Product Platform" },
  skills: [
    { id: "s1", skill: { id: "sk1", name: "Next.js 16 App Router" } },
    { id: "s2", skill: { id: "sk2", name: "React 19 & Server Actions" } },
    { id: "s3", skill: { id: "sk3", name: "TypeScript & Zod" } },
    { id: "s4", skill: { id: "sk4", name: "LiveKit WebRTC & WebSockets" } },
    { id: "s5", skill: { id: "sk5", name: "Prisma ORM & PostgreSQL" } },
  ],
  rounds: [
    {
      id: "r1",
      orderIndex: 0,
      title: "Round 1: AI Voice Screening",
      category: "Screening",
      durationMinutes: 20,
      interviewers: [],
    },
    {
      id: "r2",
      orderIndex: 1,
      title: "Round 2: AI Virtual Compiler & Code Arena",
      category: "Technical",
      durationMinutes: 45,
      interviewers: [
        {
          id: "int-1",
          employee: {
            id: "emp-1",
            role: EmployeeRole.HIRING_MANAGER,
            user: { id: "u-1", name: "Aarav Sharma", email: "aarav.sharma@devcenter.io", image: "" },
          },
        },
      ],
    },
    {
      id: "r3",
      orderIndex: 2,
      title: "Round 3: Live System Design & Architecture",
      category: "Technical",
      durationMinutes: 60,
      interviewers: [
        {
          id: "int-2",
          employee: {
            id: "emp-2",
            role: EmployeeRole.RECRUITER,
            user: { id: "u-2", name: "Neha Verma", email: "neha.verma@devcenter.io", image: "" },
          },
        },
        {
          id: "int-3",
          employee: {
            id: "emp-3",
            role: EmployeeRole.GLOBAL_ADMIN,
            user: { id: "u-3", name: "Marcus Vance", email: "marcus.vance@devcenter.io", image: "" },
          },
        },
      ],
    },
    {
      id: "r4",
      orderIndex: 3,
      title: "Round 4: Executive Culture & Offer Finalization",
      category: "Management",
      durationMinutes: 30,
      interviewers: [
        {
          id: "int-4",
          employee: {
            id: "emp-1",
            role: EmployeeRole.OWNER,
            user: { id: "u-1", name: "Aarav Sharma", email: "aarav.sharma@devcenter.io", image: "" },
          },
        },
      ],
    },
  ],
  applications: [
    {
      id: "app-1",
      createdAt: "2026-07-16T14:30:00.000Z",
      updatedAt: "2026-07-28T16:00:00.000Z",
      status: "Hired",
      source: "LinkedIn Recruiter",
      expectedSalary: 220000,
      screeningScore: 94,
      candidate: {
        id: "cand-1",
        user: { id: "usr-1", name: "Sophia Chen", email: "sophia.chen@example.com", image: "" },
      },
      currentRound: { id: "r4", title: "Round 4: Executive Culture", orderIndex: 3 },
      screeningResult: { overallScore: 94, voiceScore: 92, codingScore: 96, recommendation: "Strong_Hire" },
      offer: { id: "off-1", status: "Accepted", offeredSalary: 225000, updatedAt: "2026-07-28T16:00:00.000Z" },
    },
    {
      id: "app-2",
      createdAt: "2026-07-18T11:15:00.000Z",
      updatedAt: "2026-07-30T12:00:00.000Z",
      status: "Hired",
      source: "Employee Referral",
      expectedSalary: 210000,
      screeningScore: 91,
      candidate: {
        id: "cand-2",
        user: { id: "usr-2", name: "Alex Rivera", email: "alex.rivera@example.com", image: "" },
      },
      currentRound: { id: "r4", title: "Round 4: Executive Culture", orderIndex: 3 },
      screeningResult: { overallScore: 91, voiceScore: 90, codingScore: 92, recommendation: "Strong_Hire" },
      offer: { id: "off-2", status: "Accepted", offeredSalary: 215000, updatedAt: "2026-07-30T12:00:00.000Z" },
    },
    {
      id: "app-3",
      createdAt: "2026-07-20T09:45:00.000Z",
      updatedAt: "2026-07-25T15:20:00.000Z",
      status: "Interviewing",
      source: "Organic Careers Site",
      expectedSalary: 195000,
      screeningScore: 86,
      candidate: {
        id: "cand-3",
        user: { id: "usr-3", name: "Elena Rostova", email: "elena.rostova@example.com", image: "" },
      },
      currentRound: { id: "r3", title: "Round 3: Live System Design", orderIndex: 2 },
      screeningResult: { overallScore: 86, voiceScore: 85, codingScore: 87, recommendation: "Hire" },
    },
    {
      id: "app-4",
      createdAt: "2026-07-22T16:00:00.000Z",
      updatedAt: "2026-07-23T10:00:00.000Z",
      status: "Applied",
      source: "Indeed Jobs",
      expectedSalary: 185000,
      screeningScore: 78,
      candidate: {
        id: "cand-4",
        user: { id: "usr-4", name: "David Kim", email: "david.kim@example.com", image: "" },
      },
      currentRound: { id: "r1", title: "Round 1: AI Voice Screening", orderIndex: 0 },
      screeningResult: { overallScore: 78, voiceScore: 76, codingScore: 80, recommendation: "Hire" },
    },
  ],
  jobBoardPosts: [
    { id: "post-1", boardName: "LinkedIn Jobs", status: "Active", postUrl: "https://linkedin.com" },
    { id: "post-2", boardName: "Indeed Enterprise", status: "Active", postUrl: "https://indeed.com" },
    { id: "post-3", boardName: "Dev Center Career Portal", status: "Published", postUrl: "https://app.dev-center.io/jobs" },
  ],
  approvals: [
    {
      id: "appr-1",
      stepOrder: 1,
      status: "Approved",
      approver: { user: { name: "Aarav Sharma", email: "aarav.sharma@devcenter.io" } },
    },
    {
      id: "appr-2",
      stepOrder: 2,
      status: "Approved",
      approver: { user: { name: "Marcus Vance", email: "marcus.vance@devcenter.io" } },
    },
  ],
}

import { useParams, useRouter } from "next/navigation"
import { useJobsStore } from "../store/jobs-store"

export function useJobDetails(explicitJobId?: string) {
  const router = useRouter()
  const params = useParams()
  const jobId = explicitJobId || (params?.jobId as string) || ""
  const {
    detailsActiveTab: activeTab,
    candidateSearch,
    candidateStatusFilter,
    setDetailsActiveTab: setActiveTab,
    setCandidateSearch,
    setCandidateStatusFilter,
  } = useJobsStore()

  const utils = trpc.useUtils()

  // Fetch job details query
  const jobQuery = trpc.jobs.getById.useQuery(
    { id: jobId },
    {
      staleTime: 1000 * 60 * 2,
      retry: false,
    }
  )

  // Use real data if returned from DB, or fallback to full rich mock data
  const job = (jobQuery.data || MOCK_JOB_DATA) as any

  // Mutations
  const closeJobMutation = trpc.jobs.close.useMutation({
    onSuccess: () => {
      toast.success("Job status updated successfully")
      utils.jobs.getById.invalidate({ id: jobId })
      utils.jobs.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update job status")
    },
  })

  const cloneJobMutation = trpc.jobs.clone.useMutation({
    onSuccess: (newJob) => {
      toast.success("Job requisition cloned successfully")
      utils.jobs.list.invalidate()
      router.push(`/jobs/${newJob.id}`)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clone job requisition")
    },
  })

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    if (!job?.applications) return []
    let list = job.applications

    if (candidateStatusFilter !== "ALL") {
      list = list.filter((app: any) => app.status === candidateStatusFilter)
    }

    if (candidateSearch.trim()) {
      const q = candidateSearch.toLowerCase().trim()
      list = list.filter(
        (app: any) =>
          app.candidate?.user?.name?.toLowerCase().includes(q) ||
          app.candidate?.user?.email?.toLowerCase().includes(q) ||
          app.source?.toLowerCase().includes(q)
      )
    }

    return list
  }, [job?.applications, candidateStatusFilter, candidateSearch])

  // Hired candidates list
  const hiredApplications = useMemo(() => {
    if (!job?.applications) return []
    return job.applications.filter(
      (app: any) => app.status === "Hired" || app.status === "OfferAccepted"
    )
  }, [job?.applications])

  // Copy shareable public link
  const handleCopyShareLink = () => {
    const publicUrl = `${getAppUrl()}/jobs/${jobId}`
    navigator.clipboard.writeText(publicUrl)
    toast.success("Public job application link copied to clipboard")
  }

  // Clone handler
  const handleCloneJob = () => {
    cloneJobMutation.mutate({ jobId })
  }

  // Close / Mark Completed handler
  const handleMarkCompleted = () => {
    closeJobMutation.mutate({ jobId })
  }

  return {
    job,
    isLoading: jobQuery.isLoading && !job,
    isError: Boolean(jobQuery.isError && !job),
    error: jobQuery.error,
    activeTab,
    setActiveTab,
    candidateSearch,
    setCandidateSearch,
    candidateStatusFilter,
    setCandidateStatusFilter,
    filteredApplications,
    hiredApplications,
    handleCopyShareLink,
    handleCloneJob,
    handleMarkCompleted,
    isMutating: closeJobMutation.isPending || cloneJobMutation.isPending,
  }
}

export type JobDetailsState = ReturnType<typeof useJobDetails>
