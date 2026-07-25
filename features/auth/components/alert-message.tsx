import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageType = "info" | "error" | "success"

const ICONS: Record<MessageType, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
}

const STYLES: Record<MessageType, string> = {
  error: "bg-destructive/10 border-destructive/20 text-destructive",
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
}

export const AlertMessage = ({ message }: { message: { text: string; type: MessageType } }) => {
  const Icon = ICONS[message.type]

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed",
        STYLES[message.type]
      )}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <p className="text-start">{message.text}</p>
    </div>
  )
}
