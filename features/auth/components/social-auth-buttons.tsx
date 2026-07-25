"use client"

import React from "react"
import { SocialButton, SocialProvider, SocialAuthIntent } from "@/components/ui/social-button"

interface SocialAuthButtonsProps {
  providers?: SocialProvider[]
  mode?: "login" | "register"
  intent?: SocialAuthIntent
  disabled?: boolean
  callbackUrl?: string
}

export function SocialAuthButtons({
  providers = ["google", "github", "linkedin"],
  mode = "login",
  intent,
  disabled = false,
  callbackUrl,
}: SocialAuthButtonsProps) {
  return (
    <div className="w-full space-y-3">
      <div className="relative flex items-center justify-center pt-2 pb-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">or</span>
        </div>
      </div>
      {providers.map((provider) => (
        <SocialButton
          key={provider}
          provider={provider}
          mode={mode}
          intent={intent}
          disabled={disabled}
          callbackUrl={callbackUrl}
        />
      ))}
    </div>
  )
}
