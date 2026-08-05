"use client"

import Link from "next/link"
import { useJobsList } from "@/features/(organization)/jobs/hooks/use-jobs-list"
import { useJobActions } from "@/features/(organization)/jobs/hooks/use-job-actions"
import { JobsGridView } from "./jobs-grid-view"
import { JobsTableView } from "./jobs-table-view"
import { CloneJobDialog } from "./clone-job-dialog"
import { CloseJobDialog } from "./close-job-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, LayoutGrid, List, Search, Briefcase, CheckCircle2, Clock, FileText, Archive } from "lucide-react"
import { JobStatus } from "@/types/enums"
import { cn } from "@/lib/utils"

export function CreateNewJobDashboard() {
  const {
    jobs,
    metrics,
    departments,
    isLoading,
    viewMode,
    activeStatusTab,
    searchQuery,
    selectedDepartmentId,
    setViewMode,
    setActiveStatusTab,
    setSearchQuery,
    setSelectedDepartmentId,
  } = useJobsList()

  const {
    isCloneDialogOpen,
    isCloseDialogOpen,
    cloneTitle,
    isCloning,
    isClosing,
    setCloneTitle,
    openCloneDialog,
    closeCloneDialog,
    openCloseDialog,
    closeCloseDialog,
    handleCloneConfirm,
    handleCloseConfirm,
  } = useJobActions()

  const statusTabs: Array<{ id: JobStatus | "ALL"; label: string; count: number; icon: any }> = [
    { id: "ALL", label: "All Requisitions", count: metrics.total, icon: Briefcase },
    { id: JobStatus.ACTIVE, label: "Active Published", count: metrics.active, icon: CheckCircle2 },
    { id: JobStatus.PENDING_APPROVAL, label: "Pending Approval", count: metrics.pendingApproval, icon: Clock },
    { id: JobStatus.DRAFT, label: "Drafts", count: metrics.draft, icon: FileText },
    { id: JobStatus.COMPLETED, label: "Archived", count: metrics.completed, icon: Archive },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Requisitions</h1>
          <p className="text-sm text-muted-foreground">
            Manage active job postings, multi-round interview pipelines, and approval workflows.
          </p>
        </div>

        <Button asChild className="font-semibold shadow-xs">
          <Link href="/jobs/create-job">
            <Plus className="w-4 h-4 mr-2" /> Create Requisition
          </Link>
        </Button>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeStatusTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="outline"
              onClick={() => setActiveStatusTab(tab.id)}
              className={cn(
                "p-3.5 h-auto rounded-lg text-left flex flex-col items-stretch justify-start font-normal space-y-1 transition-all",
                isActive
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-muted-foreground">{tab.label}</span>
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              </div>
              <p className="text-xl font-bold text-foreground">{tab.count}</p>
            </Button>
          )
        })}
      </div>

      {/* Controls Bar: Search, Department Filter, View Mode Toggle */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requisitions or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Department Dropdown */}
            <Select
              value={selectedDepartmentId || "all"}
              onValueChange={(val) => setSelectedDepartmentId(val === "all" ? null : val)}
            >
              <SelectTrigger className="h-9 w-full sm:w-48 text-xs">
                <SelectValue placeholder="Filter Department" />
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

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md p-1 bg-muted/30 self-end sm:self-auto gap-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("grid")}
              className="h-7 text-xs font-medium gap-1"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </Button>

            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("table")}
              className="h-7 text-xs font-medium gap-1"
            >
              <List className="w-3.5 h-3.5" /> Table
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main View Render */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : viewMode === "grid" ? (
        <JobsGridView jobs={jobs} onClone={openCloneDialog} onClose={openCloseDialog} />
      ) : (
        <JobsTableView jobs={jobs} onClone={openCloneDialog} onClose={openCloseDialog} />
      )}

      {/* Clone Job Dialog */}
      <CloneJobDialog
        isOpen={isCloneDialogOpen}
        title={cloneTitle}
        isCloning={isCloning}
        onTitleChange={setCloneTitle}
        onClose={closeCloneDialog}
        onConfirm={handleCloneConfirm}
      />

      {/* Close Job Dialog */}
      <CloseJobDialog
        isOpen={isCloseDialogOpen}
        isClosing={isClosing}
        onClose={closeCloseDialog}
        onConfirm={handleCloseConfirm}
      />
    </div>
  )
}
