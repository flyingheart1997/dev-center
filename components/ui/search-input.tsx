"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onChange("")
      onClear?.()
    }

    return (
      <InputGroup className={cn("h-9", containerClassName)}>
        <InputGroupAddon align="inline-start">
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputGroupAddon>

        <InputGroupInput
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("text-xs", className)}
          {...props}
        />

        {value && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <X className="h-3.5 w-3.5" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }
)

SearchInput.displayName = "SearchInput"
