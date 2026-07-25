import { Dashboard } from '@/components/ui/dashboard';
import { ReactNode } from 'react'
import { getDashboardLinks } from '../utils/sidebar-utils';

interface DashboardLayoutProps {
    children: ReactNode;
    dashboardType: 'candidate' | 'organization'
}

export const DashboardLayout = ({ children, dashboardType }: DashboardLayoutProps) => {
    const links = getDashboardLinks(dashboardType)
    return (
        <Dashboard links={links}>
            {children}
        </Dashboard>
    )
}
