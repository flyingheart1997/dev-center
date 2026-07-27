"use client"

import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Filter, RotateCcw } from "lucide-react"

interface JobsFilterDialogProps {
  selectedDepartment?: string | null
  selectedRemoteType?: string | null
  departments?: Array<{ id: string; name: string }>
  onDepartmentChange: (deptId: string | null) => void
  onRemoteTypeChange: (remoteType: string | null) => void
  onReset: () => void
}

export function JobsFilterDialog({
  selectedDepartment,
  selectedRemoteType,
  departments = [],
  onDepartmentChange,
  onRemoteTypeChange,
  onReset,
}: JobsFilterDialogProps) {
  const activeCount = (selectedDepartment ? 1 : 0) + (selectedRemoteType ? 1 : 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeCount > 0 ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs shrink-0"
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filter
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1.5 px-1.5 py-0 text-[10px] bg-background text-foreground"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4" align="end">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-semibold text-xs text-foreground">Filter Requisitions</h4>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="text-[11px] h-6 px-1 text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          )}
        </div>

        {/* Filter Group 1: Department */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium text-muted-foreground block">
            Department
          </Label>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={selectedDepartment === null ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => onDepartmentChange(null)}
            >
              All Departments
            </Badge>
            {departments.map((dept) => (
              <Badge
                key={dept.id}
                variant={selectedDepartment === dept.id ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => onDepartmentChange(dept.id)}
              >
                {dept.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Filter Group 2: Work Setup */}
        <div className="space-y-2 pt-1 border-t border-border/50">
          <Label className="text-[11px] font-medium text-muted-foreground block">
            Work Setup
          </Label>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={selectedRemoteType === null ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => onRemoteTypeChange(null)}
            >
              All Setups
            </Badge>
            {["REMOTE", "HYBRID", "ONSITE"].map((type) => (
              <Badge
                key={type}
                variant={selectedRemoteType === type ? "default" : "outline"}
                className="cursor-pointer text-xs capitalize"
                onClick={() => onRemoteTypeChange(type)}
              >
                {type.toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
