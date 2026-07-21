
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GooeyInput } from "./gooey-input";
import Link from "next/link";
import { BellIcon, LogOut, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
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
import { signOut } from "next-auth/react";
import { Button } from "./button";

export function Dashboard({ children, links }: { children: React.ReactNode, links: Array<{ label: string; href: string; icon: React.ReactNode }> }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn("flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",)}
        >
            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-4 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                        <Button size='icon' variant='ghost' onClick={() => signOut()}>
                            <LogOut />
                        </Button>
                    </div>
                </SidebarBody>
            </Sidebar>
            <SidebarContent children={children} links={links} />
        </div>
    );
}
export const Logo = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 text-sm font-normal text-black"
        >
            <div className="h-10 w-10 shrink-0 rounded-full">
                <img src='/logo.png' alt="logo" className="h-full w-full" />
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
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
                <img src='/logo.png' alt="logo" className="h-full w-full" />
            </div>
        </Link>
    );
};


const SidebarContent = ({ children, links }: { children: React.ReactNode, links: Array<{ label: string; href: string; icon: React.ReactNode }> }) => {
    const pathname = usePathname();
    const routes = pathname.split('/');
    const link = links[0]
    const route = routes[2];

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
                                            <Link href={link.href}>
                                                <span className={cn("font-medium hover:text-foreground hover:underline underline-offset-2 transition-all",)}>{link.label}</span>
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {route && <BreadcrumbSeparator />}
                                    {route &&
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <span className="capitalize">{route.replace(/-/g, ' ')}</span>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    }
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex gap-4 items-center">
                            <GooeyInput placeholder="Search..." />
                            <Tooltip content="Notifications" >
                                <Link href='/notifications'>
                                    <BellIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                                </Link>
                            </Tooltip>
                            <Tooltip content="Settings">
                                <Link href='/settings'>
                                    <Settings className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                                </Link>
                            </Tooltip>
                        </div>
                    </header>

                    <div className="p-2 pt-0 w-full flex-1 min-h-0 overflow-hidden">
                        <div className="rounded-2xl bg-neutral-200 h-full p-2 md:p-4 dark:bg-neutral-900/40 flex-1 space-y-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
