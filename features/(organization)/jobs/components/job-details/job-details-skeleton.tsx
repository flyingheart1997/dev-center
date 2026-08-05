"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-5 w-full min-w-0 animate-pulse">
      {/* 1. Hero Header Banner Skeleton */}
      <Card className="p-4 sm:p-5 border border-border shadow-xs bg-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-7 w-64 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </Card>

      {/* 2. KPI Analytics Strip Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border p-4 bg-card">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-3.5 w-28 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Main Page Layout Grid (Left: 9, Right: 3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start w-full">
        {/* LEFT MAIN COLUMN (9 COLS) */}
        <div className="xl:col-span-9 space-y-6 min-w-0 w-full">
          {/* Job Details Spec Card Skeleton */}
          <Card className="border border-border shadow-xs pt-0">
            <CardHeader className="py-4 shadow-sm">
              <Skeleton className="h-5 w-64 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left spec details */}
                <div className="lg:col-span-7 space-y-3">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md mt-4" />
                  <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>

                {/* Right approval routing */}
                <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-border/60 lg:pl-5">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rounds Section Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-60 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[1, 2, 3, 4].map((r) => (
                <Card key={r} className="p-3.5 space-y-3 border border-border">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Candidates ATS Section Skeleton */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <Skeleton className="h-8 w-64 rounded-md" />
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                {[1, 2, 3, 4, 5].map((p) => (
                  <Skeleton key={p} className="h-7 w-20 rounded-md shrink-0" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((c) => (
                <Skeleton key={c} className="h-28 w-full rounded-xl border border-border" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (3 COLS) */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 min-w-0 w-full">
          {/* Column 1 */}
          <div className="space-y-5">
            {/* Creation Properties Card Skeleton */}
            <Card className="border border-border pt-0">
              <CardHeader className="py-4 shadow-sm">
                <Skeleton className="h-4 w-36 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                  <div key={row} className="flex justify-between">
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hired Candidates Card Skeleton */}
            <Card className="border border-border pt-0">
              <CardHeader className="py-4 shadow-sm">
                <Skeleton className="h-4 w-36 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Column 2 */}
          <div className="space-y-5">
            {/* Connected Job Boards Card Skeleton */}
            <Card className="border border-border pt-0">
              <CardHeader className="py-4 shadow-sm">
                <Skeleton className="h-4 w-40 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-2 pt-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* Workspace Requisitions Card Skeleton */}
            <Card className="border border-border pt-0">
              <CardHeader className="py-4 shadow-sm">
                <Skeleton className="h-4 w-40 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-2 pt-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
