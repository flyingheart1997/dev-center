import { create } from "zustand"
import { JobStatus, EmploymentType, ExperienceLevel, RemoteType, RoundCategory } from "@/types/enums"
import { CreateJobInput, JobRoundInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"

interface JobsStoreState {
  // Wizard state
  wizardStep: number
  wizardDraft: CreateJobInput

  // List View state
  viewMode: "grid" | "table"
  activeStatusTab: JobStatus | "ALL"
  searchQuery: string
  selectedDepartmentId: string | null

  // Job Details View state (Zustand State)
  detailsActiveTab: string
  candidateSearch: string
  candidateStatusFilter: string

  // Candidate Drawer state
  selectedApplicationId: string | null
  isCandidateDrawerOpen: boolean

  // Dialog states
  cloneJobId: string | null
  isCloneDialogOpen: boolean
  closeJobId: string | null
  isCloseDialogOpen: boolean

  // Actions
  setWizardStep: (step: number) => void
  updateWizardDraft: (partial: Partial<CreateJobInput>) => void
  resetWizardDraft: () => void
  setViewMode: (mode: "grid" | "table") => void
  setActiveStatusTab: (tab: JobStatus | "ALL") => void
  setSearchQuery: (query: string) => void
  setSelectedDepartmentId: (deptId: string | null) => void
  setDetailsActiveTab: (tab: string) => void
  setCandidateSearch: (query: string) => void
  setCandidateStatusFilter: (filter: string) => void
  openCandidateDrawer: (applicationId: string) => void
  closeCandidateDrawer: () => void
  openCloneDialog: (jobId: string) => void
  closeCloneDialog: () => void
  openCloseDialog: (jobId: string) => void
  closeCloseDialog: () => void
}

const defaultRounds: JobRoundInput[] = [
  {
    title: "AI Pre-Screening",
    category: RoundCategory.SCREENING,
    durationMinutes: 30,
    orderIndex: 0,
    interviewerIds: [],
  },
  {
    title: "Round 1: Technical Coding",
    category: RoundCategory.TECHNICAL,
    durationMinutes: 60,
    orderIndex: 1,
    interviewerIds: [],
  },
  {
    title: "Round 2: System Architecture & Pair Programming",
    category: RoundCategory.DESIGN,
    durationMinutes: 60,
    orderIndex: 2,
    interviewerIds: [],
  },
  {
    title: "Round 3: Behavioral & Culture Fit",
    category: RoundCategory.BEHAVIORAL,
    durationMinutes: 45,
    orderIndex: 3,
    interviewerIds: [],
  },
]

const initialWizardDraft: CreateJobInput = {
  title: "",
  businessUnitId: null,
  branchId: null,
  departmentId: null,
  employmentType: EmploymentType.FULL_TIME,
  experienceLevel: ExperienceLevel.MID,
  remoteType: RemoteType.ONSITE,
  salaryMin: 80000,
  salaryMax: 140000,
  currency: "USD",
  location: "San Francisco, CA",
  isInternalOnly: false,
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  description: "We are seeking an exceptional engineer to join our dynamic team...",
  rounds: defaultRounds,
  status: JobStatus.DRAFT,
}

export const useJobsStore = create<JobsStoreState>((set) => ({
  wizardStep: 1,
  wizardDraft: initialWizardDraft,
  viewMode: "grid",
  activeStatusTab: "ALL",
  searchQuery: "",
  selectedDepartmentId: null,
  detailsActiveTab: "candidates",
  candidateSearch: "",
  candidateStatusFilter: "ALL",
  selectedApplicationId: null,
  isCandidateDrawerOpen: false,
  cloneJobId: null,
  isCloneDialogOpen: false,
  closeJobId: null,
  isCloseDialogOpen: false,

  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardDraft: (partial) =>
    set((state) => ({
      wizardDraft: { ...state.wizardDraft, ...partial },
    })),
  resetWizardDraft: () => set({ wizardStep: 1, wizardDraft: initialWizardDraft }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveStatusTab: (tab) => set({ activeStatusTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDepartmentId: (deptId) => set({ selectedDepartmentId: deptId }),
  setDetailsActiveTab: (tab) => set({ detailsActiveTab: tab }),
  setCandidateSearch: (query) => set({ candidateSearch: query }),
  setCandidateStatusFilter: (filter) => set({ candidateStatusFilter: filter }),
  openCandidateDrawer: (applicationId) =>
    set({ selectedApplicationId: applicationId, isCandidateDrawerOpen: true }),
  closeCandidateDrawer: () => set({ isCandidateDrawerOpen: false, selectedApplicationId: null }),
  openCloneDialog: (jobId) => set({ cloneJobId: jobId, isCloneDialogOpen: true }),
  closeCloneDialog: () => set({ cloneJobId: null, isCloneDialogOpen: false }),
  openCloseDialog: (jobId) => set({ closeJobId: jobId, isCloseDialogOpen: true }),
  closeCloseDialog: () => set({ closeJobId: null, isCloseDialogOpen: false }),
}))
