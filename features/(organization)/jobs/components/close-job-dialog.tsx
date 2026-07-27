import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface CloseJobDialogProps {
  isOpen: boolean
  isClosing: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CloseJobDialog({
  isOpen,
  isClosing,
  onClose,
  onConfirm,
}: CloseJobDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" /> Close Job Requisition?
          </DialogTitle>
          <DialogDescription>
            Closing this requisition will archive the job post. New candidate applications will no longer be accepted for this position. Existing candidate applications in the ATS pipeline will remain accessible.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isClosing}>
            Keep Requisition Open
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isClosing}>
            {isClosing ? "Closing..." : "Confirm Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
