import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface CloneJobDialogProps {
  isOpen: boolean
  title: string
  isCloning: boolean
  onTitleChange: (val: string) => void
  onClose: () => void
  onConfirm: () => void
}

export function CloneJobDialog({
  isOpen,
  title,
  isCloning,
  onTitleChange,
  onClose,
  onConfirm,
}: CloneJobDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" /> Clone Job Requisition
          </DialogTitle>
          <DialogDescription>
            This will duplicate the job description, required skills, and custom interview evaluation rounds into a new draft requisition.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="cloneTitle" className="text-xs font-semibold">
            New Job Title
          </Label>
          <Input
            id="cloneTitle"
            placeholder="Copy of job requisition title..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isCloning}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isCloning}>
            {isCloning ? "Cloning..." : "Duplicate Requisition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
