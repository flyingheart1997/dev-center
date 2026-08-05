"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar"

export function LandingHeader() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navItems = [
    { name: "Platform", link: "#ats-pipeline" },
    { name: "AI Screening", link: "#ai-screening" },
    { name: "Live Rooms", link: "#live-interviews" },
    { name: "Pricing", link: "#pricing" },
  ]

  return (
    <Navbar className="py-4 px-4 max-w-7xl mx-auto">
      {/* Desktop Navigation using resizable NavBody */}
      <NavBody>
        <NavbarLogo />

        <NavItems items={navItems} className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <NavbarButton variant="secondary" onClick={() => router.push("/login")}>
            Sign In
          </NavbarButton>

          <NavbarButton variant="primary" onClick={() => router.push("/register")} className="gap-1 flex items-center">
            <span>Start Hiring</span>
            <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="flex flex-col space-y-2 py-2">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-1.5"
              >
                {item.name}
              </a>
            ))}

            <div className="flex items-center gap-2 pt-3 border-t border-border mt-2">
              <NavbarButton variant="secondary" onClick={() => router.push("/login")} className="w-full">
                Sign In
              </NavbarButton>
              <NavbarButton variant="primary" onClick={() => router.push("/register")} className="w-full">
                Start Hiring
              </NavbarButton>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
