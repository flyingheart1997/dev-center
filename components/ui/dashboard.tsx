"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GooeyInput } from "./gooey-input";
import Link from "next/link";
import { BellIcon, LogOut, Settings, User, Building2, ChevronDown, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Sidebar,
    SidebarBody,
    SidebarLink
} from "@/components/ui/sidebar";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tooltip } from "./tooltip";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { UserProfileDialog } from "@/features/dashboard/components/user-profile-dialog";
import { trpc } from "@/lib/trpc/client";
import { Button } from "./button";

export function Dashboard({
    children,
    links
}: {
    children: React.ReactNode;
    links: Array<{ label: string; href: string; icon: React.ReactNode }>;
}) {
    const [open, setOpen] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className={cn("flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800")}>
            <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />

            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-6">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}

                        {/* Workspace Switcher Header */}
                        {user?.organizationId && open && <WorkspaceSwitcherHeader />}

                        <div className="mt-4 flex flex-col gap-1.5">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom User Profile Section */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                        <UserButton
                            sidebarOpen={open}
                            openProfileDialog={setProfileDialogOpen}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            <SidebarContent
                links={links}
                openProfileDialog={setProfileDialogOpen}
            >
                {children}
            </SidebarContent>
        </div>
    );
}

function UserButton({ sidebarOpen, openProfileDialog, className }: { sidebarOpen?: boolean, openProfileDialog: (open: boolean) => void, className?: string }) {

    const { data: session } = useSession();

    const user = session?.user;
    const userName = user?.name || "User Account";
    const userEmail = user?.email || "";
    const userRole = user?.role ? user.role.replace(/_/g, " ") : "Candidate";
    const userImage = user?.image || "";
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(`flex h-auto items-center justify-start gap-2 w-full p-1 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 transition-colors text-left group`, className)}>
                    <Avatar className="h-8 w-8 shrink-0 border border-border">
                        {userImage ? (
                            <AvatarImage src={userImage} alt={userName} />
                        ) : null}
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    {sidebarOpen && (
                        <div className="flex-1 min-w-0 flex flex-col">
                            <span className="text-xs font-semibold truncate text-foreground">
                                {userName}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                {userRole}
                            </span>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-70">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground truncate flex-1">{userName}</p>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                {userRole}
                            </Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function WorkspaceSwitcherHeader() {
    const { data: orgSettings } = trpc.organization.getSettings.useQuery(undefined, {
        staleTime: 1000 * 60 * 5,
    });

    const orgName = orgSettings?.name || "My Organization";

    return (
        <div className="mt-3 mb-1 px-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-900/40 border border-neutral-300/40 dark:border-neutral-700/50">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold truncate text-foreground">{orgName}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5 text-amber-500" /> Enterprise
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center text-sm font-normal text-foreground"
        >
            <div className="h-10 w-10 shrink-0 rounded-full">
                <img src="/logo.png" alt="logo" className="h-full w-full" />
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre text-lg font-bold text-foreground"
            >
                Dev Center
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 text-sm font-normal text-black"
        >
            <div className="h-10 w-10 shrink-0 rounded-full">
                <img src="/logo.png" alt="logo" className="h-full w-full" />
            </div>
        </Link>
    );
};

const SidebarContent = ({
    links,
    children,
    openProfileDialog
}: {
    children: React.ReactNode;
    links: Array<{ label: string; href: string; icon: React.ReactNode }>;
    openProfileDialog: (open: boolean) => void
}) => {
    const pathname = usePathname();
    const routes = pathname.split("/");
    const link = links[0];
    const route = routes[2] || routes[1];

    return (
        <div className="flex flex-1 rounded-tl-2xl">
            <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 relative min-h-0 overflow-hidden">
                    <header className="h-14 px-6 flex items-center rounded-tl-2xl justify-between shrink-0 backdrop-blur-xs">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href={link?.href || "/dashboard"}>
                                                <span className={cn("font-medium hover:text-foreground hover:underline underline-offset-2 transition-all")}>
                                                    {link?.label || "Dashboard"}
                                                </span>
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {route && route !== "dashboard" && <BreadcrumbSeparator />}
                                    {route && route !== "dashboard" && (
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <span className="capitalize">{route.replace(/-/g, " ")}</span>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex gap-4 items-center">
                            <GooeyInput placeholder="Search..." />
                            <Tooltip content="Notifications">
                                <Link href="/notifications" className="relative">
                                    <BellIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                                </Link>
                            </Tooltip>
                            <Tooltip content="Profile">
                                <UserButton
                                    className="w-auto"
                                    openProfileDialog={openProfileDialog}
                                />
                            </Tooltip>
                        </div>
                    </header>

                    <div className="p-2 pt-0 w-full flex-1 min-h-0 overflow-hidden">
                        <div className="rounded-2xl bg-neutral-200 h-full p-2 md:p-4 dark:bg-neutral-900/40 flex-1 space-y-6 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
