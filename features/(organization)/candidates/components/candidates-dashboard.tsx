"use client"

import React, { useState } from "react"
import { trpc } from "@/lib/trpc/client"
import { CandidateEvaluationCard, CandidateEvaluationData } from "./candidate-evaluation-card"
import { CandidateGrowthChart } from "./candidate-growth-chart"
import { CandidateKpisWidget } from "./candidate-kpis-widget"
import { TopMeritCandidatesWidget } from "./top-merit-candidates-widget"
import { TalentPoolSummaryWidget } from "./talent-pool-summary-widget"
import { CandidateFilterDialog } from "./candidate-filter-dialog"
import { SearchInput } from "@/components/ui/search-input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Users, UserCheck } from "lucide-react"
import { ApplicantStatus } from "@/types/enums"

// Fallback Demo Mock Data for Visual Design Preview
const fallbackCandidates: CandidateEvaluationData[] = [
  {
    id: "demo-1",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@example.com",
    candidatePhone: "+91 98765 43210",
    candidateLocation: "Mumbai, India",
    jobTitle: "Senior Full-Stack Engineer",
    departmentName: "Engineering",
    status: ApplicantStatus.INTERVIEWING,
    screeningScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    candidateName: "Priya Patel",
    candidateEmail: "priya.p@example.com",
    candidatePhone: "+91 98123 67890",
    candidateLocation: "Bengaluru, India",
    jobTitle: "Frontend Developer (React 19)",
    departmentName: "Product Design",
    status: ApplicantStatus.OFFER,
    screeningScore: 88,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    candidateName: "Rohan Verma",
    candidateEmail: "rohan.verma@example.com",
    candidatePhone: "+91 97654 32109",
    candidateLocation: "Delhi NCR, India",
    jobTitle: "Backend Microservices Architect",
    departmentName: "Engineering",
    status: ApplicantStatus.SCREENING,
    screeningScore: 78,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    candidateName: "Ananya Iyer",
    candidateEmail: "ananya.iyer@example.com",
    candidatePhone: "+91 99012 34567",
    candidateLocation: "Hyderabad, India",
    jobTitle: "DevOps & Infrastructure Lead",
    departmentName: "Cloud Ops",
    status: ApplicantStatus.HIRED,
    screeningScore: 95,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-5",
    candidateName: "Vikram Malhotra",
    candidateEmail: "vikram.m@example.com",
    candidatePhone: "+91 98450 11223",
    candidateLocation: "Pune, India",
    jobTitle: "AI & ML Systems Specialist",
    departmentName: "AI Research",
    status: ApplicantStatus.APPLIED,
    screeningScore: 68,
    createdAt: new Date().toISOString(),
  },
]

const fallbackMonthlyGrowth = [
  { month: "Jan", total: 42, hired: 5, interviewing: 12 },
  { month: "Feb", total: 58, hired: 8, interviewing: 18 },
  { month: "Mar", total: 65, hired: 10, interviewing: 22 },
  { month: "Apr", total: 80, hired: 14, interviewing: 25 },
  { month: "May", total: 95, hired: 18, interviewing: 30 },
  { month: "Jun", total: 110, hired: 22, interviewing: 35 },
  { month: "Jul", total: 130, hired: 26, interviewing: 40 },
]

const fallbackTopMerit = [
  {
    id: "demo-4",
    job: { title: "DevOps & Infrastructure Lead", department: { name: "Cloud Ops" } },
    candidate: {
      id: "cand-4",
      experienceYears: 7,
      currentDesignation: "Senior DevOps Engineer",
      user: {
        name: "Ananya Iyer",
        email: "ananya.iyer@example.com",
        location: "Hyderabad, India",
      },
      skills: [{ skill: { name: "Kubernetes" } }, { skill: { name: "AWS" } }, { skill: { name: "Terraform" } }],
    },
    screeningResult: { overallScore: 95, recommendation: "Strong_Hire" },
  },
  {
    id: "demo-1",
    job: { title: "Senior Full-Stack Engineer", department: { name: "Engineering" } },
    candidate: {
      id: "cand-1",
      experienceYears: 5,
      currentDesignation: "Full-Stack Developer",
      user: {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        location: "Mumbai, India",
      },
      skills: [{ skill: { name: "React" } }, { skill: { name: "Node.js" } }, { skill: { name: "TypeScript" } }],
    },
    screeningResult: { overallScore: 92, recommendation: "Strong_Hire" },
  },
  {
    id: "demo-2",
    job: { title: "Frontend Developer (React 19)", department: { name: "Product Design" } },
    candidate: {
      id: "cand-2",
      experienceYears: 4,
      currentDesignation: "Frontend Specialist",
      user: {
        name: "Priya Patel",
        email: "priya.p@example.com",
        location: "Bengaluru, India",
      },
      skills: [{ skill: { name: "React" } }, { skill: { name: "Tailwind CSS" } }, { skill: { name: "Next.js" } }],
    },
    screeningResult: { overallScore: 88, recommendation: "Hire" },
  },
]

export function CandidatesDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | "ALL">("ALL")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // 1. Fetch Paginated Candidates Directory
  const { data: candidatesData, isLoading: isLoadingCandidates } = trpc.candidates.list.useQuery(
    {
      search: searchQuery || undefined,
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
      departmentId: selectedDepartmentId || undefined,
      page: currentPage,
      limit: 50,
    },
    {
      placeholderData: (prev) => prev,
    }
  )

  // 2. Fetch Analytics Metrics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = trpc.candidates.getAnalytics.useQuery()

  // 3. Fetch Top Merit Candidates
  const { data: topMeritData, isLoading: isLoadingMerit } = trpc.candidates.getTopMeritCandidates.useQuery()

  // 4. Fetch Department list for filter
  const { data: orgStructure } = trpc.jobs.getOrgStructure.useQuery()

  // Map database application records or fallback to mock data
  const fetchedItems: CandidateEvaluationData[] = (candidatesData?.applications || []).map((app) => ({
    id: app.id,
    candidateName: app.candidate.user?.name || app.candidate.user?.email || "Candidate",
    candidateEmail: app.candidate.user?.email || null,
    candidatePhone: app.candidate.user?.phone || null,
    candidateLocation: app.candidate.user?.location || null,
    candidateImage: app.candidate.user?.image || null,
    jobTitle: app.job.title,
    departmentName: app.job.department?.name,
    status: app.status,
    screeningScore: app.screeningResult?.overallScore ?? app.screeningResult?.resumeScore ?? null,
    createdAt: new Date(app.createdAt).toISOString(),
  }))

  const candidateItems = fetchedItems.length > 0 ? fetchedItems : fallbackCandidates
  const hasRealGrowthData = Boolean(
    analyticsData?.monthlyGrowth && analyticsData.monthlyGrowth.some((item) => item.total > 0)
  )
  const monthlyGrowth =
    hasRealGrowthData && analyticsData?.monthlyGrowth
      ? analyticsData.monthlyGrowth
      : fallbackMonthlyGrowth
  const topMeritCandidates =
    topMeritData && topMeritData.length > 0 ? topMeritData : (fallbackTopMerit as any)

  const activeFilterCount =
    (selectedStatus !== "ALL" ? 1 : 0) + (selectedDepartmentId !== null ? 1 : 0)

  const resetFilters = () => {
    setSelectedStatus("ALL")
    setSelectedDepartmentId(null)
    setSearchQuery("")
    setCurrentPage(1)
  }

  const selectedDepartmentName = orgStructure?.departments.find(
    (d) => d.id === selectedDepartmentId
  )?.name

  const pagination = candidatesData?.pagination || {
    totalCount: candidateItems.length,
    totalPages: 1,
    currentPage: 1,
  }

  return (
    <div className="space-y-4">
      {/* 1. Top Row: 4 KPI Summary Cards (Full-Width Banner) */}
      <CandidateKpisWidget
        totalScreened={analyticsData?.totalScreened || 115}
        avgScore={88}
        passRate={74}
        activeCount={candidatesData?.pagination?.totalCount || candidateItems.length}
        isLoading={isLoadingAnalytics}
      />

      {/* 2. Main Split Section (Row 2: Left 2 Cols vs Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Columns Wide): Candidate Growth Chart + Candidate List */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          {/* Candidate Application Trends Chart */}
          <CandidateGrowthChart data={monthlyGrowth} isLoading={isLoadingAnalytics} />

          {/* Candidate Evaluations Directory List */}
          <Card className="border border-border shadow-xs pt-0">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 shadow-sm dark:bg-neutral-800">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
                  <Users className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="truncate">Candidate Evaluations</span>
                </CardTitle>
                <CardDescription className="truncate mt-0.5">
                  All candidate ATS applications and AI pre-screening evaluations
                </CardDescription>
              </div>

              {/* Header Right: SearchInput + Filter Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <SearchInput
                  placeholder="Search name, email, phone, location..."
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val)
                    setCurrentPage(1)
                  }}
                  containerClassName="flex-1 sm:w-64"
                />

                <CandidateFilterDialog
                  selectedStatus={selectedStatus}
                  selectedDepartmentId={selectedDepartmentId}
                  departments={orgStructure?.departments}
                  onStatusChange={(st) => {
                    setSelectedStatus(st)
                    setCurrentPage(1)
                  }}
                  onDepartmentChange={(deptId) => {
                    setSelectedDepartmentId(deptId)
                    setCurrentPage(1)
                  }}
                  onReset={resetFilters}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-3">
              {/* Active Applied Filters Pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs pb-1">
                  <span className="text-muted-foreground font-medium">Applied Filters:</span>
                  {selectedStatus !== "ALL" && (
                    <Badge variant="outline" className="text-[11px] capitalize">
                      Status: {selectedStatus}
                    </Badge>
                  )}
                  {selectedDepartmentName && (
                    <Badge variant="outline" className="text-[11px]">
                      Dept: {selectedDepartmentName}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={resetFilters}
                    className="text-[11px] text-destructive hover:bg-destructive/10 h-6 px-1.5"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Candidates List */}
              {isLoadingCandidates ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <CandidateEvaluationCard key={idx} isLoading={true} />
                ))
              ) : candidateItems.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center space-y-2">
                  <UserCheck className="w-8 h-8 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">No Candidates Found</h3>
                  <p className="text-xs text-muted-foreground">
                    There are no candidates matching your current filter or search query.
                  </p>
                </div>
              ) : (
                candidateItems.map((candidate) => (
                  <CandidateEvaluationCard key={candidate.id} candidate={candidate} />
                ))
              )}

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} Candidates)
                  </span>

                  <Pagination className="justify-end w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                          className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Column Wide): Top Merit Leaderboard + Talent Pool Summary */}
        <div className="space-y-4 min-w-0">
          {/* 1. Top Merit Candidates Leaderboard */}
          <TopMeritCandidatesWidget
            candidates={topMeritCandidates}
            isLoading={isLoadingMerit}
          />

          {/* 2. Talent Pool & Scope Summary Card */}
          <TalentPoolSummaryWidget
            stats={{
              activeJobsCount: orgStructure?.businessUnits?.length || 8,
              interviewingCount: candidateItems.filter((c) => c.status === ApplicantStatus.INTERVIEWING).length || 18,
              offersCount: candidateItems.filter((c) => c.status === ApplicantStatus.OFFER).length || 4,
              hiredCount: candidateItems.filter((c) => c.status === ApplicantStatus.HIRED).length || 12,
            }}
          />
        </div>
      </div>
    </div>
  )
}
