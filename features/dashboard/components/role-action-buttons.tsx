"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Send, Calendar, UserPlus } from "lucide-react"
import { InviteEmployeeDialog } from "@/features/organization/components/invite-employee-dialog"
import { EmployeeRole } from "@/types/enums"

interface RoleActionButtonsProps {
  role?: EmployeeRole | string
}

export function RoleActionButtons({ role }: RoleActionButtonsProps) {
  const currentRole = role as EmployeeRole | undefined

  // Role permissions
  const canCreateJob =
    currentRole === EmployeeRole.OWNER ||
    currentRole === EmployeeRole.GLOBAL_ADMIN ||
    currentRole === EmployeeRole.BUSINESS_UNIT_ADMIN ||
    currentRole === EmployeeRole.BRANCH_ADMIN ||
    currentRole === EmployeeRole.RECRUITER ||
    currentRole === EmployeeRole.HIRING_MANAGER

  const canPostJob =
    currentRole === EmployeeRole.OWNER ||
    currentRole === EmployeeRole.GLOBAL_ADMIN ||
    currentRole === EmployeeRole.RECRUITER

  const canScheduleInterview =
    currentRole === EmployeeRole.OWNER ||
    currentRole === EmployeeRole.GLOBAL_ADMIN ||
    currentRole === EmployeeRole.RECRUITER ||
    currentRole === EmployeeRole.HIRING_MANAGER ||
    currentRole === EmployeeRole.INTERVIEWER

  const canInviteMember =
    currentRole === EmployeeRole.OWNER ||
    currentRole === EmployeeRole.GLOBAL_ADMIN ||
    currentRole === EmployeeRole.BUSINESS_UNIT_ADMIN ||
    currentRole === EmployeeRole.BRANCH_ADMIN ||
    currentRole === EmployeeRole.RECRUITER

  return (
    <div className="flex flex-col space-y-2.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Operational Actions
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {canCreateJob && (
          <Button asChild size="lg" className="w-full justify-center h-10 text-xs">
            <Link href="/jobs/new">
              <Plus className="h-4 w-4" />
              Create Job
            </Link>
          </Button>
        )}

        {canPostJob && (
          <Button variant="outline" size="lg" className="w-full justify-center h-10 text-xs" asChild>
            <Link href="/jobs?tab=drafts">
              <Send className="h-4 w-4 text-emerald-500" />
              Post Job
            </Link>
          </Button>
        )}

        {canScheduleInterview && (
          <Button variant="outline" size="lg" className="w-full justify-center h-10 text-xs" asChild>
            <Link href="/interviews">
              <Calendar className="h-4 w-4 text-purple-500" />
              Schedule Interview
            </Link>
          </Button>
        )}

        {canInviteMember && (
          <InviteEmployeeDialog>
            <Button variant="outline" size="lg" className="w-full justify-center h-10 text-xs">
              <UserPlus className="h-4 w-4 text-primary" />
              Invite Team Member
            </Button>
          </InviteEmployeeDialog>
        )}
      </div>
    </div>
  )
}
