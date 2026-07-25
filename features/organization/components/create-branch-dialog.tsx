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
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useCreateBranchDialog } from "../hooks/use-create-branch-dialog"

import { FormFeedback } from "@/components/ui/form-feedback"

interface CreateBranchDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function CreateBranchDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: CreateBranchDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  const { form, onSubmit, isPending, successMessage, errorMessage } = useCreateBranchDialog(onOpenChange || (() => {}))
  const { register, setValue, watch, formState: { errors } } = form
  const isHeadOfficeValue = watch("isHeadOffice")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Physical Office Branch</DialogTitle>
          <DialogDescription>
            Register a new office location under your organization structure.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <FormFeedback successMessage={successMessage} errorMessage={errorMessage} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input id="branch-name" placeholder="e.g. Mumbai Tech Park" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-code">Branch Code</Label>
              <Input id="branch-code" placeholder="e.g. BOM-01" {...register("code")} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="branch-city">City</Label>
              <Input id="branch-city" placeholder="e.g. Mumbai" {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-country">Country</Label>
              <Input id="branch-country" placeholder="e.g. India" {...register("country")} />
              {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="branch-timezone">Timezone</Label>
            <Input id="branch-timezone" placeholder="Asia/Kolkata or UTC" {...register("timezone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="branch-address">Full Address (Optional)</Label>
            <Input id="branch-address" placeholder="Building, Street, Zip Code" {...register("address")} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 mt-2">
            <div className="space-y-0.5">
              <Label htmlFor="head-office" className="text-sm font-medium">Headquarters / Head Office</Label>
              <p className="text-xs text-muted-foreground">Mark this branch as the primary organization headquarters.</p>
            </div>
            <Switch
              id="head-office"
              checked={isHeadOfficeValue}
              onCheckedChange={(checked) => setValue("isHeadOffice", checked)}
            />
          </div>

          <DialogFooter className="mt-4 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Branch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
