"use client"

import { Dashboard } from '@/components/ui/dashboard';
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { getDashboardLinks } from '../utils/sidebar-utils';

interface DashboardLayoutProps {
    children: ReactNode;
    dashboardType: 'candidate' | 'organization'
}

export const DashboardLayout = ({ children, dashboardType }: DashboardLayoutProps) => {
    const { data: session } = useSession()
    const userRole = session?.user?.role as string | undefined

    const links = getDashboardLinks(dashboardType, userRole)
    return (
        <Dashboard links={links}>
            {children}
        </Dashboard>
    )
}
