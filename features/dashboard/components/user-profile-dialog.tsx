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
import { Loader2 } from "lucide-react"
import { useUserProfileDialog } from "../hooks/use-user-profile-dialog"
import { FormFeedback } from "@/components/ui/form-feedback"

interface UserProfileDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function UserProfileDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: UserProfileDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  const { form, onSubmit, isPending, successMessage, errorMessage } = useUserProfileDialog(onOpenChange || (() => {}))
  const { register, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
          <DialogDescription>
            Update your personal details, profile picture URL, and professional links.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <FormFeedback successMessage={successMessage} errorMessage={errorMessage} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Your name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Profile Avatar URL</Label>
            <Input id="image" {...register("image")} placeholder="https://example.com/avatar.jpg" />
            {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location / City</Label>
            <Input id="location" {...register("location")} placeholder="e.g. San Francisco, CA" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" {...register("githubUrl")} placeholder="https://github.com/..." />
            </div>
          </div>

          <DialogFooter className="mt-4 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
