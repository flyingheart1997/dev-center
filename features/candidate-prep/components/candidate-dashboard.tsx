
"use client";
import {
    Mic,
    FileText,
    Code2,
    Briefcase,
    User,
    LayoutDashboard,
} from "lucide-react"
import { Dashboard } from "@/components/ui/dashboard";

export function CandidateDashboard({ children }: { children: React.ReactNode }) {
    const links = [
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
    return (
        <Dashboard links={links}>
            {children}
        </Dashboard>
    );
}