"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 text-foreground flex flex-col justify-between">
      {/* Resizable Aceternity Navbar */}
      <Navbar className="py-4 px-4 max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <NavbarButton variant="secondary" onClick={() => router.push("/login")}>
              Sign in
            </NavbarButton>
            <NavbarButton variant="primary" onClick={() => router.push("/register")}>
              Get Started
            </NavbarButton>
          </div>
        </NavBody>
      </Navbar>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dev-Center SaaS Ecosystem. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
