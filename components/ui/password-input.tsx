"use client"

import * as React from "react"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onGenerate?: () => void
  preventPaste?: boolean
  preventCopy?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, onGenerate, preventPaste, preventCopy, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (preventPaste) {
        e.preventDefault()
      }
      props.onPaste?.(e)
    }

    const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (preventCopy) {
        e.preventDefault()
      }
      props.onCopy?.(e)
    }

    return (
      <InputGroup className={className}>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          ref={ref}
          onPaste={handlePaste}
          onCopy={handleCopy}
          onCut={handleCopy}
          {...props}
        />
        <InputGroupAddon align="inline-end" className="gap-0">
          {onGenerate && (
            <InputGroupButton
              type="button"
              variant="ghost"
              title="Generate Strong Password"
              onClick={onGenerate}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </InputGroupButton>
          )}
          <InputGroupButton
            type="button"
            variant="ghost"
            title={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
