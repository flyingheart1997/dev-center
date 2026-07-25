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
} from "lucide-react";

export const ORGANISATION_DASHBOARD_LINKS = [
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

export const CANDIDATE_DASHBOARD_LINKS = [
    {
        label: "Dashboard",
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
];

export const getDashboardLinks = (dashboardType: 'candidate' | 'organization') => {
    if (dashboardType === 'candidate') {
        return CANDIDATE_DASHBOARD_LINKS
    }
    return ORGANISATION_DASHBOARD_LINKS
}