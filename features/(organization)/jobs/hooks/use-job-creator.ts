import { useRouter } from "next/navigation"
import { useJobsStore } from "@/features/(organization)/jobs/store/jobs-store"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"
import { JobStatus, RoundCategory } from "@/types/enums"
import { JobRoundInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"

export function useJobCreator() {
  const router = useRouter()
  const { wizardStep, wizardDraft, setWizardStep, updateWizardDraft, resetWizardDraft } =
    useJobsStore()

  // Queries for organization structure & employees
  const { data: orgStructure, isLoading: isLoadingOrg } = trpc.jobs.getOrgStructure.useQuery()
  const { data: employees, isLoading: isLoadingEmployees } = trpc.jobs.getOrgEmployees.useQuery()

  // Mutation to create job requisition
  const createJobMutation = trpc.jobs.create.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.status === JobStatus.PENDING_APPROVAL
          ? "Job requisition submitted for approval!"
          : "Job requisition created successfully!"
      )
      resetWizardDraft()
      router.push("/jobs")
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create job requisition.")
    },
  })

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (!wizardDraft.title || wizardDraft.title.trim().length < 3) {
      toast.error("Please enter a valid job title (at least 3 characters).")
      return false
    }
    if (!wizardDraft.location || wizardDraft.location.trim().length < 2) {
      toast.error("Please specify a job location.")
      return false
    }
    if (
      wizardDraft.salaryMin !== null &&
      wizardDraft.salaryMin !== undefined &&
      wizardDraft.salaryMax !== null &&
      wizardDraft.salaryMax !== undefined &&
      wizardDraft.salaryMin > wizardDraft.salaryMax
    ) {
      toast.error("Minimum salary cannot be greater than maximum salary.")
      return false
    }
    return true
  }

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (!wizardDraft.skills || wizardDraft.skills.length === 0) {
      toast.error("Please add at least one required skill tag.")
      return false
    }
    if (!wizardDraft.description || wizardDraft.description.trim().length < 20) {
      toast.error("Please enter a comprehensive job description (at least 20 characters).")
      return false
    }
    return true
  }

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    if (!wizardDraft.rounds || wizardDraft.rounds.length === 0) {
      toast.error("Please configure at least one interview round.")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (wizardStep === 1 && !validateStep1()) return
    if (wizardStep === 2 && !validateStep2()) return
    if (wizardStep === 3 && !validateStep3()) return

    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1)
    }
  }

  const handlePrev = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    }
  }

  // Add round
  const addRound = () => {
    const nextOrder = wizardDraft.rounds.length
    const newRound: JobRoundInput = {
      title: `Round ${nextOrder + 1}: Technical Interview`,
      category: RoundCategory.TECHNICAL,
      durationMinutes: 45,
      orderIndex: nextOrder,
      interviewerIds: [],
    }
    updateWizardDraft({ rounds: [...wizardDraft.rounds, newRound] })
  }

  // Remove round
  const removeRound = (index: number) => {
    if (wizardDraft.rounds.length <= 1) {
      toast.error("A requisition must have at least one interview round.")
      return
    }
    const filtered = wizardDraft.rounds
      .filter((_, i) => i !== index)
      .map((r, i) => ({ ...r, orderIndex: i }))
    updateWizardDraft({ rounds: filtered })
  }

  // Update round
  const updateRound = (index: number, updated: Partial<JobRoundInput>) => {
    const updatedRounds = wizardDraft.rounds.map((r, i) =>
      i === index ? { ...r, ...updated } : r
    )
    updateWizardDraft({ rounds: updatedRounds })
  }

  // Submit job (Publish or Submit for Approval)
  const handleSubmit = (targetStatus: JobStatus) => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return

    createJobMutation.mutate({
      ...wizardDraft,
      status: targetStatus,
    })
  }

  return {
    wizardStep,
    wizardDraft,
    orgStructure,
    employees,
    isLoadingOrg,
    isLoadingEmployees,
    isSubmitting: createJobMutation.isPending,
    setWizardStep,
    updateWizardDraft,
    handleNext,
    handlePrev,
    addRound,
    removeRound,
    updateRound,
    handleSubmit,
  }
}
