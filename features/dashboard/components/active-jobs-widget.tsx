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
}

export function ActiveJobsWidget({ jobs }: ActiveJobsWidgetProps) {
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
    <Card className="border-border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Active Published Job Requisitions
          </CardTitle>
          <CardDescription>
            {jobs.length === 0
              ? "Live job postings receiving candidate ATS applications"
              : filteredJobs.length < jobs.length
                ? `Showing ${filteredJobs.length} of ${jobs.length} published job postings`
                : `Live job postings receiving candidate ATS applications (${jobs.length} active)`}
          </CardDescription>
        </div>

        {/* Top Search & Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchInput
            placeholder="Search active jobs..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            containerClassName="flex-1 sm:w-64"
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
        {filteredJobs.length === 0 ? (
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
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-semibold text-sm text-foreground hover:underline"
                    >
                      {job.title}
                    </Link>
                    <Badge variant="outline" className="text-[10px]">
                      {job.departmentName}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {job.location} ({job.remoteType.replace(/_/g, " ")})
                    </span>
                    <span>•</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-md text-xs font-medium">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>{job.applicantCount} Applicants</span>
                  </div>

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
