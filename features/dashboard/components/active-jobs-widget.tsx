"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/ui/search-input"
import { Briefcase, Filter, ArrowUpRight, Users, MapPin } from "lucide-react"
import { useActiveJobsFilter } from "../hooks/use-active-jobs-filter"
import { ActiveJobsFilterDialog } from "./active-jobs-filter-dialog"

import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"

export interface ActiveJobItem {
  id: string
  title: string
  departmentName: string
  branchName: string
  location: string
  remoteType: string
  experienceLevel?: string
  employmentType?: string
  skills?: string[]
  applicantCount: number
  createdAt: string
}

interface ActiveJobsWidgetProps {
  jobs: ActiveJobItem[]
  isLoading?: boolean
}

export function ActiveJobsWidget({ jobs, isLoading = false }: ActiveJobsWidgetProps) {
  const {
    filters,
    filteredJobs,
    options,
    activeFilterCount,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
  } = useActiveJobsFilter(jobs)

  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2 truncate">
            <Briefcase className="h-5 w-5 text-blue-500 shrink-0" />
            <span className="truncate">Active Published Job Requisitions</span>
          </CardTitle>
          <CardDescription className="truncate">
            {jobs.length === 0
              ? "Live job postings receiving candidate ATS applications"
              : filteredJobs.length < jobs.length
                ? `Showing ${filteredJobs.length} of ${jobs.length} published job postings`
                : `Live job postings receiving candidate ATS applications (${jobs.length} active)`}
          </CardDescription>
        </div>

        {/* Top Search & Filter Controls */}
        <div className="flex items-center gap-2 w-full xl:w-auto shrink-0">
          <SearchInput
            placeholder="Search active jobs..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            containerClassName="flex-1 xl:w-56"
          />

          <ActiveJobsFilterDialog
            filters={filters}
            options={options}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          >
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              className="h-9 text-xs shrink-0"
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px] bg-background text-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </ActiveJobsFilterDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Applied Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-muted-foreground font-medium">Applied Filters:</span>
            {filters.timeRange !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Date: {filters.timeRange}
              </Badge>
            )}
            {filters.department !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Dept: {filters.department}
              </Badge>
            )}
            {filters.experienceLevel !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Exp: {filters.experienceLevel}
              </Badge>
            )}
            {filters.remoteType !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Setup: {filters.remoteType}
              </Badge>
            )}
            {filters.employmentType !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Type: {filters.employmentType.replace(/_/g, " ")}
              </Badge>
            )}
            {filters.location !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Location: {filters.location}
              </Badge>
            )}
            {filters.skill !== "all" && (
              <Badge variant="outline" className="text-[11px]">
                Skill: {filters.skill}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="xs"
              onClick={resetFilters}
              className="text-[11px] text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Jobs List / Table */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-8 text-center border rounded-lg bg-muted/20 flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {jobs.length === 0 ? "No Active Jobs Published" : "No Matching Jobs Found"}
            </p>
            <p className="text-xs text-muted-foreground">
              {jobs.length === 0
                ? "There are currently no active job requisitions receiving candidate applications."
                : "No active job postings match your applied search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border rounded-lg overflow-hidden bg-card">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-accent/40 transition-colors gap-3"
              >
                <div className="flex flex-col space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Tooltip content={job.title}>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-sm text-foreground hover:underline truncate max-w-[70%]"
                      >
                        {job.title}
                      </Link>
                    </Tooltip>
                    <Badge variant="outline" className="text-[10px]">
                      {job.departmentName}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Tooltip content={`${job.location} (${job.remoteType.replace(/_/g, " ")})`}>
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{job.location} ({job.remoteType.replace(/_/g, " ")})</span>
                      </div>
                    </Tooltip>
                    <span>•</span>
                    <span className="shrink-0">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-center shrink-0">
                  <Badge className="flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 p-2.5 rounded-md text-xs font-medium">
                    <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{job.applicantCount} Applicants</span>
                  </Badge>

                  <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                    <Link href={`/jobs/${job.id}`}>
                      View ATS <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
