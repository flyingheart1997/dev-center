"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { trpc } from "@/lib/trpc/client"
import { JobRequisitionCard, JobRequisitionData } from "./job-requisition-card"
import { JobsKpisWidget } from "./jobs-kpis-widget"
import { PendingApprovalWidget } from "./pending-approval-widget"
import { TopPerformingJobsWidget } from "./top-performing-jobs-widget"
import { JobsFilterDialog } from "./jobs-filter-dialog"
import { TalentPoolSummaryWidget } from "@/features/(organization)/candidates/components/talent-pool-summary-widget"
import { SearchInput } from "@/components/ui/search-input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Plus, Send, FileEdit, Clock, Layers, Users, UserCheck, Award } from "lucide-react"

type JobTab = "actives" | "drafts" | "pending" | "closed" | "all"

// Fallback Mock Requisitions for Visual Design Preview
const fallbackActiveJobs: JobRequisitionData[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer (Next.js & Python)",
    departmentName: "Engineering",
    location: "San Francisco, CA",
    remoteType: "HYBRID",
    createdByName: "Aarav Sharma",
    postedAt: new Date().toISOString(),
    applicantCount: 48,
    isDraft: false,
    status: "ACTIVE",
  },
  {
    id: "job-2",
    title: "AI / ML Systems Architect",
    departmentName: "AI Research",
    location: "Remote",
    remoteType: "REMOTE",
    createdByName: "Priya Patel",
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    applicantCount: 36,
    isDraft: false,
    status: "ACTIVE",
  },
  {
    id: "job-3",
    title: "Product Designer (Design Systems & WebRTC UI)",
    departmentName: "Product Design",
    location: "New York, NY",
    remoteType: "ONSITE",
    createdByName: "Rohan Verma",
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    applicantCount: 22,
    isDraft: false,
    status: "ACTIVE",
  },
  {
    id: "job-4",
    title: "DevOps & Cloud Infrastructure Specialist",
    departmentName: "Cloud Ops",
    location: "London, UK",
    remoteType: "HYBRID",
    createdByName: "Ananya Iyer",
    postedAt: new Date(Date.now() - 259200000).toISOString(),
    applicantCount: 28,
    isDraft: false,
    status: "ACTIVE",
  },
]

const fallbackDraftJobs: JobRequisitionData[] = [
  {
    id: "draft-1",
    title: "Staff Security Engineer",
    departmentName: "Cybersecurity",
    createdByName: "Aarav Sharma",
    completionPercentage: 60,
    isDraft: true,
    status: "DRAFT",
  },
  {
    id: "draft-2",
    title: "Technical Lead (Recruitment Automation)",
    departmentName: "Engineering",
    createdByName: "Neha Verma",
    completionPercentage: 80,
    isDraft: true,
    status: "DRAFT",
  },
]

const fallbackPendingJobs: JobRequisitionData[] = [
  {
    id: "pend-1",
    title: "Senior Security Architect",
    departmentName: "Cybersecurity",
    createdByName: "Aarav Sharma",
    isPendingApproval: true,
    status: "PENDING_APPROVAL",
  },
  {
    id: "pend-2",
    title: "Staff Frontend Platform Lead",
    departmentName: "Engineering",
    createdByName: "Neha Verma",
    isPendingApproval: true,
    status: "PENDING_APPROVAL",
  },
]

export function JobsDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = (searchParams.get("tab") as JobTab) || "actives"

  const [activeTab, setActiveTab] = useState<JobTab>(tabParam)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null)
  const [selectedRemoteType, setSelectedRemoteType] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: JobTab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    router.push(`/jobs?tab=${tab}`, { scroll: false })
  }

  // 1. Fetch Org Structure for department list
  const { data: orgStructure } = trpc.jobs.getOrgStructure.useQuery()

  // Select list data based on tab
  const getDisplayJobs = (): JobRequisitionData[] => {
    if (activeTab === "drafts") return fallbackDraftJobs
    if (activeTab === "pending") return fallbackPendingJobs
    if (activeTab === "all")
      return [...fallbackActiveJobs, ...fallbackPendingJobs, ...fallbackDraftJobs]
    return fallbackActiveJobs
  }

  const jobsList = getDisplayJobs()
  const activeCount = fallbackActiveJobs.length
  const draftsCount = fallbackDraftJobs.length
  const pendingCount = fallbackPendingJobs.length
  const totalCount = activeCount + draftsCount + pendingCount

  const resetFilters = () => {
    setSelectedDepartmentId(null)
    setSelectedRemoteType(null)
    setSearchQuery("")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* 1. Row 1: Top Full-Width 4-KPI Banner */}
      <JobsKpisWidget
        activeCount={activeCount}
        draftsCount={draftsCount}
        pendingCount={pendingCount}
        applicantsCount={148}
        isLoading={false}
      />

      {/* 2. Row 2: Integrated Action & Filter Control Bar (Sticky Header with bg-gray-100 dark:bg-neutral-800 shadow-sm) */}
      <div className="sticky -top-2 md:-top-4 z-30 bg-gray-100 dark:bg-neutral-800 shadow-sm p-3 rounded-xl border border-border/50 transition-all mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-center">
          {/* Left Portion (2 Columns Wide on Large Screens): Segmented Control Pills + Search + Filter */}
          <div className="lg:col-span-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0">
            {/* shadcn UI Tabs Component for Requisition Filtering */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => handleTabChange(val as JobTab)}
              className="shrink-0 w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-4 md:flex h-9! p-1 bg-background/80 dark:bg-neutral-900/80 border border-border/50 rounded-lg w-full md:w-auto">
                {[
                  { id: "all" as const, label: "All", count: totalCount, icon: Layers },
                  { id: "actives" as const, label: "Active", count: activeCount, icon: Briefcase },
                  { id: "drafts" as const, label: "Drafts", count: draftsCount, icon: FileEdit },
                  { id: "pending" as const, label: "Pending", count: pendingCount, icon: Clock },
                ].map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="text-xs font-semibold px-3 py-2 gap-1.5 flex items-center justify-center"
                    >
                      <TabIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {tab.label} ({tab.count})
                      </span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            {/* SearchInput + JobsFilterDialog */}
            <div className="flex items-center gap-2 min-w-0 flex-1 md:w-auto">
              <SearchInput
                placeholder="Search title, location, setup..."
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val)
                  setCurrentPage(1)
                }}
                containerClassName="flex-1 md:w-52"
              />

              <JobsFilterDialog
                selectedDepartment={selectedDepartmentId}
                selectedRemoteType={selectedRemoteType}
                departments={orgStructure?.departments}
                onDepartmentChange={setSelectedDepartmentId}
                onRemoteTypeChange={setSelectedRemoteType}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Right Portion (1 Column Wide on Large Screens): Action Buttons right aligned */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Tooltip content="Quickly publish a pre-configured job requisition">
              <Button variant="outline" size="sm" asChild className="h-9 text-xs font-semibold flex-1 sm:flex-none">
                <Link href="/jobs/create">
                  <Send className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Post Job
                </Link>
              </Button>
            </Tooltip>

            <Tooltip content="Open full multi-step Job Requisition Setup Wizard">
              <Button size="sm" asChild className="h-9 text-xs font-semibold bg-primary shadow-xs flex-1 sm:flex-none">
                <Link href="/jobs/create">
                  <Plus className="w-4 h-4 mr-1" /> Create Job
                </Link>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 3. Row 3: Main Split Content (2:1 Grid Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Columns Wide): Requisitions Directory List */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <Card className="border border-border shadow-xs pt-0">
            <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
                  <Briefcase className="h-5 w-5 text-primary shrink-0" />
                  <span className="truncate capitalize">
                    {activeTab === "actives"
                      ? "Active Published Job Requisitions"
                      : activeTab === "drafts"
                        ? "Incomplete Draft Requisitions"
                        : activeTab === "pending"
                          ? "Requisitions Pending Approval"
                          : "All Organization Requisitions"}
                  </span>
                </CardTitle>
                <CardDescription className="truncate mt-0.5">
                  {activeTab === "actives"
                    ? "Live job postings receiving candidate ATS applications"
                    : activeTab === "drafts"
                      ? "Setup wizard incomplete requisitions needing completion"
                      : activeTab === "pending"
                        ? "Requisitions submitted for Admin / Owner verification"
                        : "Complete list of active, draft, and pending requisitions"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-3">
              {jobsList.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center space-y-2">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">No Requisitions Found</h3>
                  <p className="text-xs text-muted-foreground">
                    There are no job requisitions matching your current tab or search query.
                  </p>
                </div>
              ) : (
                jobsList.map((job) => <JobRequisitionCard key={job.id} job={job} />)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Column Wide): Pending Approvals Queue + Top Performing Jobs + Talent Pool Summary */}
        <div className="space-y-4 min-w-0">
          {/* 1. Pending Approvals Queue Widget */}
          <PendingApprovalWidget pendingJobs={fallbackPendingJobs as any} />

          {/* 2. Top Performing Requisitions */}
          <TopPerformingJobsWidget />

          {/* 3. Branch & Requisition Department Scope Distribution */}
          <TalentPoolSummaryWidget
            title="Department Scope & Requisitions"
            description="Distribution of requisitions across organizational departments"
            customStages={[
              {
                label: "Engineering & AI Research",
                count: 8,
                percentage: 42,
                barColor: "bg-blue-500",
                textColor: "text-blue-600 dark:text-blue-400",
                pillBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                icon: Layers,
              },
              {
                label: "Product Design & WebRTC UI",
                count: 5,
                percentage: 26,
                barColor: "bg-purple-500",
                textColor: "text-purple-600 dark:text-purple-400",
                pillBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                icon: Users,
              },
              {
                label: "Cloud Ops & Cybersecurity",
                count: 4,
                percentage: 21,
                barColor: "bg-amber-500",
                textColor: "text-amber-600 dark:text-amber-400",
                pillBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                icon: UserCheck,
              },
              {
                label: "Executive & Legal Compliance",
                count: 2,
                percentage: 11,
                barColor: "bg-emerald-500",
                textColor: "text-emerald-600 dark:text-emerald-400",
                pillBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                icon: Award,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
