"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, CheckCircle2, Send, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PendingOfferItem {
  id: string
  candidateName: string
  jobTitle: string
  departmentName?: string
  salaryFormatted: string
  status: "Sent" | "Pending_Approval" | "Accepted" | "Rejected"
  sentAt: string
}

interface PendingOffersWidgetProps {
  offers: PendingOfferItem[]
  isLoading?: boolean
}

export function PendingOffersWidget({ offers, isLoading = false }: PendingOffersWidgetProps) {
  return (
    <Card className="border-border shadow-xs pt-0">
      <CardHeader className="flex flex-row items-center justify-between py-3 shadow-sm dark:bg-neutral-800">
        <div className="min-w-0 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold flex items-center gap-2 min-w-0">
            <DollarSign className="h-5 w-5 text-emerald-500 shrink-0" />
            <Tooltip side="top" content="Pending Job Offers">
              <span className="w-fit max-w-full inline-block truncate">
                Pending Job Offers
              </span>
            </Tooltip>
          </CardTitle>
          <CardDescription className="min-w-0 mt-0.5">
            <Tooltip side="top" content="Offer letters pending sign-off or candidate response">
              <span className="w-fit max-w-full inline-block truncate text-xs text-muted-foreground">
                Offer letters pending sign-off or candidate response
              </span>
            </Tooltip>
          </CardDescription>
        </div>
        {!isLoading && offers.length > 0 && (
          <Badge variant="secondary" className="text-xs shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 p-2.5 ml-3">
            {offers.length} Active
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Active Job Offers</p>
            <p className="text-xs text-muted-foreground mt-0.5">Job offers generated for candidates will appear here.</p>
          </div>
        ) : (
          offers.map((item) => {
            const isSent = item.status === "Sent"
            const isPendingApproval = item.status === "Pending_Approval"
            const initials = item.candidateName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors space-y-2.5"
              >
                {/* Top Row: Avatar + Candidate Name & Role (left), Status Badge (right) */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 flex-1">
                      <Tooltip side="top" content={item.candidateName}>
                        <span className="font-semibold text-sm text-foreground truncate leading-tight w-fit max-w-full inline-block">
                          {item.candidateName}
                        </span>
                      </Tooltip>
                      <Tooltip side="top" content={item.jobTitle}>
                        <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5 w-fit max-w-full inline-block">
                          {item.jobTitle}
                        </span>
                      </Tooltip>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-normal py-0.5 px-2 shrink-0",
                      isSent && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                      isPendingApproval && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                      !isSent && !isPendingApproval && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    )}
                  >
                    {isSent ? (
                      <Send className="h-3 w-3 mr-1 text-blue-500" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1 text-amber-500" />
                    )}
                    {isSent ? "Offer Sent" : isPendingApproval ? "Pending Sign-off" : item.status}
                  </Badge>
                </div>

                {/* Bottom Row: Offered Salary & Action Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 min-w-0">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                    {item.salaryFormatted}
                  </span>

                  <Button size="xs" variant="outline" className="h-7 text-xs shrink-0 ml-auto" asChild>
                    <Link href={`/offers/${item.id}`}>
                      View Offer
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
