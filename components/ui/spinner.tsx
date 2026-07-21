import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

interface SpinnerProps {
  className?: string;
  size?: string | number;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 16, ...props }) => {
  return (
    <Loader2Icon size={size} data-slot="spinner" role="status" aria-label="Loading" className={cn("animate-spin", className)} {...props} />
  )
}
