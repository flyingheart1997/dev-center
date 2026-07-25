import React from "react"
import {
  Briefcase,
  CreditCard,
  Settings,
  UserCheck,
  Users,
  Video,
  Mic,
  FileText,
  Code2,
  User,
  LayoutDashboard,
  Building2,
  ShieldAlert,
  FolderGit2,
  Gift,
  HelpCircle,
  ClipboardList,
} from "lucide-react"
import { EmployeeRole } from "@/types/enums"

export interface SidebarLinkItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  allowedRoles?: EmployeeRole[]
}

export const ORGANIZATION_DASHBOARD_LINKS: SidebarLinkItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "Job Requisitions",
    href: "/jobs",
    icon: <Briefcase className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [
      EmployeeRole.OWNER,
      EmployeeRole.GLOBAL_ADMIN,
      EmployeeRole.BUSINESS_UNIT_ADMIN,
      EmployeeRole.BRANCH_ADMIN,
      EmployeeRole.RECRUITER,
      EmployeeRole.HIRING_MANAGER,
    ],
  },
  {
    label: "Candidates ATS",
    href: "/candidates",
    icon: <Users className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "Live Interviews",
    href: "/interviews",
    icon: <Video className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "Approvals Queue",
    href: "/approvals",
    icon: <ClipboardList className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [
      EmployeeRole.OWNER,
      EmployeeRole.GLOBAL_ADMIN,
      EmployeeRole.BUSINESS_UNIT_ADMIN,
      EmployeeRole.BRANCH_ADMIN,
      EmployeeRole.HIRING_MANAGER,
    ],
  },
  {
    label: "Talent CRM Pools",
    href: "/talent-pools",
    icon: <FolderGit2 className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [
      EmployeeRole.OWNER,
      EmployeeRole.GLOBAL_ADMIN,
      EmployeeRole.BUSINESS_UNIT_ADMIN,
      EmployeeRole.BRANCH_ADMIN,
      EmployeeRole.RECRUITER,
    ],
  },
  {
    label: "Employee Referrals",
    href: "/referrals",
    icon: <Gift className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "Question Library",
    href: "/questions",
    icon: <HelpCircle className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [
      EmployeeRole.OWNER,
      EmployeeRole.GLOBAL_ADMIN,
      EmployeeRole.RECRUITER,
      EmployeeRole.INTERVIEWER,
    ],
  },
  {
    label: "Org Hierarchy & Team",
    href: "/organization",
    icon: <Building2 className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [
      EmployeeRole.OWNER,
      EmployeeRole.GLOBAL_ADMIN,
      EmployeeRole.BUSINESS_UNIT_ADMIN,
      EmployeeRole.BRANCH_ADMIN,
    ],
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    icon: <ShieldAlert className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [EmployeeRole.OWNER, EmployeeRole.GLOBAL_ADMIN],
  },
  {
    label: "Billing & Plans",
    href: "/billing",
    icon: <CreditCard className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [EmployeeRole.OWNER, EmployeeRole.GLOBAL_ADMIN],
  },
  {
    label: "Workspace Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
    allowedRoles: [EmployeeRole.OWNER, EmployeeRole.GLOBAL_ADMIN],
  },
]

export const CANDIDATE_DASHBOARD_LINKS: SidebarLinkItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "AI Voice Mock Arena",
    href: "/voice-arena",
    icon: <Mic className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "ATS Resume Studio",
    href: "/resume-studio",
    icon: <FileText className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "AI Coding Arena",
    href: "/coding-practice",
    icon: <Code2 className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "My Applications",
    href: "/applications",
    icon: <Briefcase className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
  {
    label: "Profile & Resume",
    href: "/profile",
    icon: <User className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />,
  },
]

export const getDashboardLinks = (
  dashboardType: "candidate" | "organization",
  userRole?: string
): SidebarLinkItem[] => {
  if (dashboardType === "candidate") {
    return CANDIDATE_DASHBOARD_LINKS
  }

  if (!userRole) {
    return ORGANIZATION_DASHBOARD_LINKS
  }

  return ORGANIZATION_DASHBOARD_LINKS.filter((item) => {
    if (!item.allowedRoles) return true
    return item.allowedRoles.includes(userRole as EmployeeRole)
  })
}