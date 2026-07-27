"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, RotateCcw } from "lucide-react"
import { ApplicantStatus } from "@/types/enums"

interface CandidateFilterDialogProps {
  selectedStatus: ApplicantStatus | "ALL"
  selectedDepartmentId: string | null
  departments?: Array<{ id: string; name: string }>
  onStatusChange: (status: ApplicantStatus | "ALL") => void
  onDepartmentChange: (departmentId: string | null) => void
  onReset: () => void
}

export function CandidateFilterDialog({
  selectedStatus,
  selectedDepartmentId,
  departments = [],
  onStatusChange,
  onDepartmentChange,
  onReset,
}: CandidateFilterDialogProps) {
  const activeFilterCount =
    (selectedStatus !== "ALL" ? 1 : 0) + (selectedDepartmentId !== null ? 1 : 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeFilterCount > 0 ? "default" : "outline"}
          size="sm"
          className="h-9 text-xs shrink-0"
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filter
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1.5 px-1.5 py-0 text-[10px] bg-background text-foreground font-bold"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary" /> Filter Candidate Evaluations
          </h4>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="text-[11px] h-6 px-1.5 text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          )}
        </div>

        <div className="space-y-3 text-xs">
          {/* Status Select */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Application Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => onStatusChange(val as ApplicantStatus | "ALL")}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={ApplicantStatus.APPLIED}>Applied</SelectItem>
                <SelectItem value={ApplicantStatus.SCREENING}>AI Pre-Screened</SelectItem>
                <SelectItem value={ApplicantStatus.INTERVIEWING}>Interviewing</SelectItem>
                <SelectItem value={ApplicantStatus.OFFER}>Offer Extended</SelectItem>
                <SelectItem value={ApplicantStatus.HIRED}>Hired</SelectItem>
                <SelectItem value={ApplicantStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Select */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Department</Label>
            <Select
              value={selectedDepartmentId || "all"}
              onValueChange={(val) => onDepartmentChange(val === "all" ? null : val)}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
