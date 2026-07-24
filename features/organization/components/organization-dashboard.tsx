
"use client";
import {
  Briefcase,
  LayoutDashboard,
  Users,
  Video,
  UserCheck,
  CreditCard,
  Settings,
} from "lucide-react"
import { Dashboard } from "@/components/ui/dashboard";

export function OrganizationDashboard({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "ATS Jobs & Pipeline",
      href: "/jobs",
      icon: <Briefcase className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "Candidates",
      href: "/candidates",
      icon: <Users className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "Live Interviews",
      href: "/interviews",
      icon: <Video className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "Team & Approvals",
      href: "/team",
      icon: <UserCheck className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "Billing & Plans",
      href: "/billing",
      icon: <CreditCard className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    },
  ]

  return (
    <Dashboard links={links}>
      {children}
    </Dashboard>
  );
}