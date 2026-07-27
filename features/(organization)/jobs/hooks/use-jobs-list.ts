import { useJobsStore } from "@/features/(organization)/jobs/store/jobs-store"
import { trpc } from "@/lib/trpc/client"
import { JobStatus } from "@/types/enums"

export function useJobsList() {
  const {
    viewMode,
    activeStatusTab,
    searchQuery,
    selectedDepartmentId,
    setViewMode,
    setActiveStatusTab,
    setSearchQuery,
    setSelectedDepartmentId,
  } = useJobsStore()

  const statusFilter = activeStatusTab === "ALL" ? undefined : (activeStatusTab as JobStatus)

  const { data, isLoading, refetch, isFetching } = trpc.jobs.list.useQuery(
    {
      status: statusFilter,
      departmentId: selectedDepartmentId || undefined,
      search: searchQuery || undefined,
      page: 1,
      limit: 50,
    },
    {
      placeholderData: (previousData) => previousData,
    }
  )

  const { data: orgStructure } = trpc.jobs.getOrgStructure.useQuery()

  return {
    jobs: data?.jobs || [],
    metrics: data?.metrics || { total: 0, active: 0, draft: 0, pendingApproval: 0, completed: 0 },
    departments: orgStructure?.departments || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    viewMode,
    activeStatusTab,
    searchQuery,
    selectedDepartmentId,
    setViewMode,
    setActiveStatusTab,
    setSearchQuery,
    setSelectedDepartmentId,
    refetch,
  }
}
