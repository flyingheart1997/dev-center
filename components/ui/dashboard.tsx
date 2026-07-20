
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
                        <div className="mt-8 flex flex-col gap-2">
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
                    </div>
                </SidebarBody>
            </Sidebar>
            <SidebarContent children={children} />
        </div>
    );
}
export const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                Acet Labs
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};


const SidebarContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-1 rounded-tl-2xl">
            <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 relative min-h-0 overflow-hidden">
                    <header className="h-14 px-6 flex items-center rounded-tl-2xl justify-between shrink-0 backdrop-blur-xs">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Candidate AI Studio</span>
                            <span>/</span>
                            <span className="capitalize">Prep Arena</span>
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
