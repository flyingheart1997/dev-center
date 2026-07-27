import { useState } from "react"
import { useJobsStore } from "@/features/(organization)/jobs/store/jobs-store"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"

export function useJobActions() {
  const {
    cloneJobId,
    isCloneDialogOpen,
    closeJobId,
    isCloseDialogOpen,
    openCloneDialog,
    closeCloneDialog,
    openCloseDialog,
    closeCloseDialog,
  } = useJobsStore()

  const [cloneTitle, setCloneTitle] = useState("")
  const utils = trpc.useUtils()

  const cloneMutation = trpc.jobs.clone.useMutation({
    onSuccess: (newJob) => {
      toast.success(`Job cloned successfully as draft: "${newJob.title}"`)
      closeCloneDialog()
      setCloneTitle("")
      utils.jobs.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clone job requisition.")
    },
  })

  const closeMutation = trpc.jobs.close.useMutation({
    onSuccess: () => {
      toast.success("Job requisition closed successfully.")
      closeCloseDialog()
      utils.jobs.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Failed to close job requisition.")
    },
  })

  const handleCloneConfirm = () => {
    if (!cloneJobId) return
    cloneMutation.mutate({
      jobId: cloneJobId,
      newTitle: cloneTitle.trim() || undefined,
    })
  }

  const handleCloseConfirm = () => {
    if (!closeJobId) return
    closeMutation.mutate({ jobId: closeJobId })
  }

  return {
    cloneJobId,
    isCloneDialogOpen,
    closeJobId,
    isCloseDialogOpen,
    cloneTitle,
    setCloneTitle,
    isCloning: cloneMutation.isPending,
    isClosing: closeMutation.isPending,
    openCloneDialog,
    closeCloneDialog,
    openCloseDialog,
    closeCloseDialog,
    handleCloneConfirm,
    handleCloseConfirm,
  }
}
