"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Check, Loader2 } from "lucide-react"
import { useReassignApprover } from "../hooks/use-reassign-approver"

interface ReassignApproverDropdownProps {
  requisitionId: string
  currentApproverName: string
  onReassignSuccess?: (newApproverName: string) => void
}

export function ReassignApproverDropdown({
  requisitionId,
  currentApproverName,
  onReassignSuccess,
}: ReassignApproverDropdownProps) {
  const {
    eligibleApprovers,
    activeApproverName,
    isSubmitting,
    handleSelectApprover,
  } = useReassignApprover({
    requisitionId,
    currentApproverName,
    onSuccess: onReassignSuccess,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="h-7 text-xs text-muted-foreground hover:text-foreground shrink-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <UserPlus className="h-3.5 w-3.5 mr-1 " />
          )}
          <span>Reassign</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-56 text-xs p-1">
        {eligibleApprovers.map((emp) => {
          const isCurrent = emp.name === activeApproverName
          const initials = emp.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)

          return (
            <DropdownMenuItem
              key={emp.id}
              onClick={() => handleSelectApprover(emp)}
              className="flex items-center gap-2 text-xs p-2 cursor-pointer rounded-md"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-foreground truncate text-xs">{emp.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{emp.role}</span>
              </div>

              {isCurrent && <Check className="h-4 w-4 text-purple-500 shrink-0 ml-1" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
