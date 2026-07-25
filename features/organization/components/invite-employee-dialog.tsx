"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmployeeRole } from "@/types/enums"
import { Loader2 } from "lucide-react"
import { useInviteEmployeeDialog } from "../hooks/use-invite-employee-dialog"
import { FormFeedback } from "@/components/ui/form-feedback"

interface InviteEmployeeDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function InviteEmployeeDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: InviteEmployeeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  const { form, branches, onSubmit, isPending, successMessage, errorMessage } = useInviteEmployeeDialog(
    open,
    onOpenChange || (() => {})
  )

  const { register, setValue, watch, formState: { errors } } = form
  const selectedRole = watch("role")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an official email invitation to join your organization team with a specific role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <FormFeedback successMessage={successMessage} errorMessage={errorMessage} />

          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Work Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="employee@company.com"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Assigned Employee Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(val) => setValue("role", val as EmployeeRole)}
            >
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EmployeeRole.RECRUITER}>Recruiter</SelectItem>
                <SelectItem value={EmployeeRole.INTERVIEWER}>Interviewer</SelectItem>
                <SelectItem value={EmployeeRole.HIRING_MANAGER}>Hiring Manager</SelectItem>
                <SelectItem value={EmployeeRole.BRANCH_ADMIN}>Branch Admin</SelectItem>
                <SelectItem value={EmployeeRole.BUSINESS_UNIT_ADMIN}>Business Unit Admin</SelectItem>
                <SelectItem value={EmployeeRole.GLOBAL_ADMIN}>Global Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>

          {branches && branches.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="invite-branch">Assigned Branch (Optional)</Label>
              <Select onValueChange={(val) => setValue("branchId", val)}>
                <SelectTrigger id="invite-branch">
                  <SelectValue placeholder="All Branches (Global Scope)" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-4 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
