"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActiveJobsFilterState } from "../utils/active-jobs-filter-utils"
import { RotateCcw, SlidersHorizontal, Calendar, Briefcase, MapPin, Sparkles, Check } from "lucide-react"

interface ActiveJobsFilterDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  filters: ActiveJobsFilterState
  options: {
    departments: string[]
    locations: string[]
    remoteTypes: string[]
    experienceLevels: string[]
    employmentTypes: string[]
    skills: string[]
  }
  onFilterChange: (key: keyof ActiveJobsFilterState, value: string) => void
  onReset: () => void
}

export function ActiveJobsFilterDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
  filters,
  options,
  onFilterChange,
  onReset,
}: ActiveJobsFilterDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  // Calculate active filter count
  const activeCount = Object.entries(filters).filter(([key, val]) => key !== "searchQuery" && val !== "all").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border-border bg-card">
        {/* Modal Header */}
        <DialogHeader className="p-5 pb-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center justify-start gap-2">
                Filter Active Job Requisitions
                {activeCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {activeCount} active
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Refine published job postings by date, department, experience, work setup, and skills.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body / Filter Categories */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* 1. Experience Level */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Experience Level
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "All Levels", value: "all" },
                { label: "Entry Level", value: "Entry" },
                { label: "Mid Level", value: "Mid" },
                { label: "Senior Level", value: "Senior" },
                { label: "Lead", value: "Lead" },
                { label: "Executive", value: "Executive" },
              ].map((exp) => {
                const isActive = filters.experienceLevel.toLowerCase() === exp.value.toLowerCase()
                return (
                  <Button
                    key={exp.value}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("experienceLevel", exp.value)}
                    className="h-8 text-xs font-normal justify-center"
                  >
                    {exp.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* 2. Date Posted / Time Range */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Date Posted
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "All Time", value: "all" },
                { label: "Past 24 Hours", value: "24h" },
                { label: "Past Week", value: "7d" },
                { label: "Past Month", value: "30d" },
              ].map((range) => {
                const isActive = filters.timeRange === range.value
                return (
                  <Button
                    key={range.value}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("timeRange", range.value)}
                    className="h-8 text-xs font-normal justify-center"
                  >
                    {range.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* 3. Department & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="filter-department" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                Department
              </Label>
              <Select
                value={filters.department}
                onValueChange={(val) => onFilterChange("department", val)}
              >
                <SelectTrigger id="filter-department" className="h-9 text-xs w-full">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {options.departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-location" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                Location
              </Label>
              <Select
                value={filters.location}
                onValueChange={(val) => onFilterChange("location", val)}
              >
                <SelectTrigger id="filter-location" className="h-9 text-xs w-full">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {options.locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Work Setup & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="filter-remote" className="text-xs font-semibold text-foreground">
                Work Setup / Remote Type
              </Label>
              <Select
                value={filters.remoteType}
                onValueChange={(val) => onFilterChange("remoteType", val)}
              >
                <SelectTrigger id="filter-remote" className="h-9 text-xs w-full">
                  <SelectValue placeholder="All Work Setups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Setups</SelectItem>
                  <SelectItem value="Onsite">Onsite</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-employment" className="text-xs font-semibold text-foreground">
                Employment Type
              </Label>
              <Select
                value={filters.employmentType}
                onValueChange={(val) => onFilterChange("employmentType", val)}
              >
                <SelectTrigger id="filter-employment" className="h-9 text-xs w-full">
                  <SelectValue placeholder="All Employment Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employment Types</SelectItem>
                  <SelectItem value="Full_Time">Full-Time</SelectItem>
                  <SelectItem value="Part_Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. Required Skills */}
          {options.skills.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="filter-skill" className="text-xs font-semibold text-foreground">
                Required Skill
              </Label>
              <Select
                value={filters.skill}
                onValueChange={(val) => onFilterChange("skill", val)}
              >
                <SelectTrigger id="filter-skill" className="h-9 text-xs w-full">
                  <SelectValue placeholder="All Required Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Required Skills</SelectItem>
                  {options.skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 m-0 border-t border-border bg-muted/20 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset All Filters
          </Button>

          <Button size="sm" onClick={() => onOpenChange?.(false)} className="text-xs">
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
