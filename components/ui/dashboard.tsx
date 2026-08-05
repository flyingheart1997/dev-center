"use client";
import React, { Fragment, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GooeyInput } from "./gooey-input";
import Link from "next/link";
import { BellIcon, LogOut, Settings, User, Building2, Sparkles } from "lucide-react";
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
        <div className={cn("flex w-full flex-1 flex-row overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800")}>
            <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />

            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between pb-6">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Logo open={open} />

                        {/* Workspace Switcher Header */}
                        {user?.organizationId && (
                            <motion.div
                                initial={false}
                                animate={{
                                    height: open ? "auto" : 0,
                                    opacity: open ? 1 : 0,
                                    marginTop: open ? "12px" : 0,
                                    marginBottom: open ? "4px" : 0,
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden shrink-0"
                            >
                                <WorkspaceSwitcherHeader />
                            </motion.div>
                        )}

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
                <Button variant="ghost" className={cn(`flex h-auto items-center justify-start gap-2 w-full p-1 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 transition-colors text-left group overflow-hidden`, className)}>
                    <Avatar className="h-8 w-8 shrink-0 border border-border">
                        {userImage ? (
                            <AvatarImage src={userImage} alt={userName} />
                        ) : null}
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <motion.div
                        initial={false}
                        animate={{
                            width: sidebarOpen ? "auto" : 0,
                            opacity: sidebarOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex-1 min-w-0 flex flex-col overflow-hidden whitespace-nowrap"
                    >
                        <span className="text-xs font-semibold truncate text-foreground">
                            {userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                            {userRole}
                        </span>
                    </motion.div>
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
        <div className="px-1">
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

export const Logo = ({ open }: { open?: boolean }) => {
    return (
        <Link
            href="/"
            className="relative shrink-0 z-20 flex items-center gap-2.5 text-sm font-normal text-foreground h-10 px-1 overflow-hidden"
        >
            <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="h-full w-full object-contain" />
            </div>
            <motion.span
                initial={false}
                animate={{
                    width: open ? "auto" : 0,
                    opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="whitespace-nowrap overflow-hidden text-lg font-extrabold bg-linear-to-r from-cyan-500 via-sky-500 to-blue-600 dark:from-cyan-300 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight inline-block"
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
    children,
    openProfileDialog
}: {
    children: React.ReactNode;
    openProfileDialog: (open: boolean) => void
}) => {
    const pathname = usePathname();
    const routes = (pathname.split("/") ?? []).filter(route => route !== 'dashboard');

    return (
        <div className="flex flex-1 min-h-0 min-w-0 rounded-tl-2xl shadow-inner">
            <div className="flex h-full w-full flex-1 min-h-0 min-w-0 flex-col gap-2 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 relative min-h-0 overflow-hidden">
                    <header className="h-14 px-6 flex items-center rounded-tl-2xl justify-between shrink-0 bg-neutral-100/90 dark:bg-neutral-800/90">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href={"/dashboard"}>
                                                <span className={cn("hover:text-foreground hover:underline underline-offset-2 transition-colors")}>
                                                    Dashboard
                                                </span>
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {routes.map((route, index) => {
                                        const active = index === routes.length - 1;
                                        const link = active ? pathname : routes.slice(0, index + 1).join("/") ?? '/dashboard'
                                        return (
                                            <Fragment key={route}>
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink asChild>
                                                        <Link href={link}>
                                                            <span className={cn("capitalize",
                                                                active ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors")}
                                                            >
                                                                {route.replace(/-/g, " ")}
                                                            </span>
                                                        </Link>
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                {index < routes.length - 1 && <BreadcrumbSeparator />}
                                            </Fragment>
                                        )
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex gap-4 items-center">
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
                        <div className="rounded-2xl bg-neutral-200 h-full p-2 md:p-4 dark:bg-neutral-900/40 flex-1 space-y-6 overflow-y-auto touch-pan-y overscroll-contain min-h-0">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
