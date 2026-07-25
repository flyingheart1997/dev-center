import { ActiveJobItem } from "../components/active-jobs-widget"

export interface ActiveJobsFilterState {
  searchQuery: string
  department: string
  remoteType: string
  experienceLevel: string
  employmentType: string
  timeRange: string // 'all' | '24h' | '7d' | '30d'
  location: string
  skill: string
}

export const INITIAL_ACTIVE_JOBS_FILTER: ActiveJobsFilterState = {
  searchQuery: "",
  department: "all",
  remoteType: "all",
  experienceLevel: "all",
  employmentType: "all",
  timeRange: "all",
  location: "all",
  skill: "all",
}

export function filterActiveJobs(
  jobs: ActiveJobItem[],
  filters: ActiveJobsFilterState
): ActiveJobItem[] {
  const query = filters.searchQuery.trim().toLowerCase()
  const now = Date.now()

  return jobs.filter((job) => {
    // 1. Search query match
    const matchesSearch =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.departmentName.toLowerCase().includes(query) ||
      job.branchName.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      (job.skills && job.skills.some((s) => s.toLowerCase().includes(query)))

    // 2. Department match
    const matchesDept =
      filters.department === "all" ||
      job.departmentName.toLowerCase() === filters.department.toLowerCase()

    // 3. Remote type match
    const matchesRemote =
      filters.remoteType === "all" ||
      job.remoteType.toLowerCase() === filters.remoteType.toLowerCase()

    // 4. Experience level match
    const matchesExp =
      filters.experienceLevel === "all" ||
      (job.experienceLevel &&
        job.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase())

    // 5. Employment type match
    const matchesEmployment =
      filters.employmentType === "all" ||
      (job.employmentType &&
        job.employmentType.toLowerCase() === filters.employmentType.toLowerCase())

    // 6. Location match
    const matchesLocation =
      filters.location === "all" ||
      job.location.toLowerCase() === filters.location.toLowerCase()

    // 7. Skill match
    const matchesSkill =
      filters.skill === "all" ||
      (job.skills && job.skills.includes(filters.skill))

    // 8. Time range match
    let matchesTime = true
    if (filters.timeRange !== "all") {
      const jobTime = new Date(job.createdAt).getTime()
      const diffHours = (now - jobTime) / (1000 * 60 * 60)
      if (filters.timeRange === "24h") {
        matchesTime = diffHours <= 24
      } else if (filters.timeRange === "7d") {
        matchesTime = diffHours <= 24 * 7
      } else if (filters.timeRange === "30d") {
        matchesTime = diffHours <= 24 * 30
      }
    }

    return (
      matchesSearch &&
      matchesDept &&
      matchesRemote &&
      matchesExp &&
      matchesEmployment &&
      matchesLocation &&
      matchesSkill &&
      matchesTime
    )
  })
}

export function getActiveJobsFilterCount(filters: ActiveJobsFilterState): number {
  let count = 0
  if (filters.department !== "all") count++
  if (filters.remoteType !== "all") count++
  if (filters.experienceLevel !== "all") count++
  if (filters.employmentType !== "all") count++
  if (filters.timeRange !== "all") count++
  if (filters.location !== "all") count++
  if (filters.skill !== "all") count++
  return count
}
