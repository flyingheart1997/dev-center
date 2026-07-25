"use client"

import { useState, useMemo } from "react"
import { ActiveJobItem } from "../components/active-jobs-widget"
import {
  ActiveJobsFilterState,
  INITIAL_ACTIVE_JOBS_FILTER,
  filterActiveJobs,
  getActiveJobsFilterCount,
} from "../utils/active-jobs-filter-utils"

export function useActiveJobsFilter(jobs: ActiveJobItem[]) {
  const [filters, setFilters] = useState<ActiveJobsFilterState>(INITIAL_ACTIVE_JOBS_FILTER)

  // Extract unique departments, locations, remoteTypes, experienceLevels, employmentTypes, skills
  const options = useMemo(() => {
    const departments = new Set<string>()
    const locations = new Set<string>()
    const remoteTypes = new Set<string>()
    const experienceLevels = new Set<string>()
    const employmentTypes = new Set<string>()
    const skills = new Set<string>()

    jobs.forEach((j) => {
      if (j.departmentName) departments.add(j.departmentName)
      if (j.location) locations.add(j.location)
      if (j.remoteType) remoteTypes.add(j.remoteType)
      if (j.experienceLevel) experienceLevels.add(j.experienceLevel)
      if (j.employmentType) employmentTypes.add(j.employmentType)
      if (j.skills && Array.isArray(j.skills)) {
        j.skills.forEach((s) => skills.add(s))
      }
    })

    return {
      departments: Array.from(departments),
      locations: Array.from(locations),
      remoteTypes: Array.from(remoteTypes),
      experienceLevels: Array.from(experienceLevels),
      employmentTypes: Array.from(employmentTypes),
      skills: Array.from(skills),
    }
  }, [jobs])

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return filterActiveJobs(jobs, filters)
  }, [jobs, filters])

  const activeFilterCount = useMemo(() => {
    return getActiveJobsFilterCount(filters)
  }, [filters])

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }))
  }

  const handleFilterChange = (key: keyof ActiveJobsFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(INITIAL_ACTIVE_JOBS_FILTER)
  }

  return {
    filters,
    filteredJobs,
    options,
    activeFilterCount,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
  }
}
