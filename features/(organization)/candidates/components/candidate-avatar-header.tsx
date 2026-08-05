"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CandidateAvatarHeaderProps {
  name: string
  email?: string | null
  image?: string | null
  jobTitle?: string
  departmentName?: string
  appliedDate?: string | null
  avatarSize?: "sm" | "md" | "lg"
  className?: string
}

export function CandidateAvatarHeader({
  name,
  email,
  image,
  jobTitle,
  departmentName,
  appliedDate,
  avatarSize = "md",
  className,
}: CandidateAvatarHeaderProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "CD"

  const sizeClasses = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  }[avatarSize]

  const formattedDate = appliedDate
    ? new Date(appliedDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className={cn("flex items-center gap-3 min-w-0 flex-1", className)}>
      <Avatar className={cn("border border-border shrink-0", sizeClasses)}>
        <AvatarImage src={image || undefined} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
          <Tooltip content={name}>
            <span className="font-semibold text-sm text-foreground truncate">{name}</span>
          </Tooltip>

          {email && (
            <Tooltip content={email}>
              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1 truncate">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{email}</span>
              </span>
            </Tooltip>
          )}
        </div>

        {(jobTitle || departmentName || formattedDate) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground min-w-0">
            {jobTitle && (
              <Tooltip content={jobTitle}>
                <span className="font-medium text-foreground/90 truncate max-w-50">
                  {jobTitle}
                </span>
              </Tooltip>
            )}

            {departmentName && (
              <div className="items-center gap-2 hidden sm:flex">
                {jobTitle && <span>•</span>}
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal shrink-0">
                  {departmentName}
                </Badge>
              </div>
            )}

            {formattedDate && (
              <>
                {(jobTitle || departmentName) && <span>•</span>}
                <span className="shrink-0">Applied {formattedDate}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
